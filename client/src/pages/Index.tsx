import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { runMacro } from "@/api/runMacro";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight, ChevronRight, Folder, FolderPlus, Home, Play, RotateCcw, Check } from "lucide-react";
import { EfizIcon } from "@/assets/EfizIcon";
import { cn } from "@/lib/utils";

type DriveFolder = { id: string; name: string; modified: string; children?: DriveFolder[] };




const PARENT_OF: Record<string, string> = {};

const NAME_OF: Record<string, string> = {
    root: "My Drive",
};


const TopBar = ({ step }: { step: number }) => (
    <header className="border-b bg-card">
        <div className="mx-auto flex max-w-75 items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
                <a
                    href="https://ivanconsuegra.com/efiz?utm_campaign=folder-duplicator&utm_source=extension&utm_medium=header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity"
                >
                    <EfizIcon className="h-9 w-9" />
                </a>
                <div className="flex flex-col justify-between py-0.5 h-9">
                    <h1 className="text-sm font-medium tracking-tight leading-none">Folder Duplicator</h1>
                    <a
                        href="https://ko-fi.com/ivanconsuegra"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors leading-none"
                    >
                        Show your support
                    </a>
                </div>
            </div>
            <span className="text-sm text-muted-foreground">{step} / 3</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-1 rounded-none" />
    </header>
);

const StepHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
    <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
);

const FolderRow = ({
    folder,
    selected,
    onClick,
    onDoubleClick,
    trailing,
}: {
    folder: DriveFolder;
    selected?: boolean;
    onClick: () => void;
    onDoubleClick?: () => void;
    trailing?: React.ReactNode;
}) => {
    const formattedDate = (() => {
        try {
            const date = new Date(folder.modified);
            return isNaN(date.getTime()) ? folder.modified : date.toLocaleString();
        } catch {
            return folder.modified;
        }
    })();

    return (
        <button
            type="button"
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-accent",
                selected && "border-primary bg-primary/5 hover:bg-primary/5"
            )}
        >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-muted", selected && "bg-primary/15")}>
                <Folder className={cn("h-5 w-5 text-muted-foreground", selected && "text-primary")} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{folder.name}</p>
                <p className="truncate text-xs text-muted-foreground">Modified {formattedDate}</p>
            </div>
            {selected ? <Check className="h-5 w-5 text-primary" /> : trailing}
        </button>
    );
};

const Index = () => {
    const queryClient = useQueryClient();
    const { data: rootFolder, isLoading } = useQuery<DriveFolder>({
        queryKey: ["rootFolders"],
        queryFn: async () => {
            const response = await runMacro("getRootFolders");
            if (response.success) {
                return response.data as unknown as DriveFolder;
            }
            throw new Error(response.message || "Error");
        }
    });
    const rootFolders = useMemo(() => rootFolder?.children || [], [rootFolder]);

    useEffect(() => {
        if (rootFolders.length > 0) {
            rootFolders.forEach(f => {
                NAME_OF[f.id] = f.name;
                PARENT_OF[f.id] = "root";
            });
        }
    }, [rootFolders]);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [sourceId, setSourceId] = useState<string | null>(null);
    const [sourceBrowseId, setSourceBrowseId] = useState<string>("root");
    const [browseId, setBrowseId] = useState<string>("root");
    const [targetId, setTargetId] = useState<string | null>("root");

    const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
    const [isFetchingSource, setIsFetchingSource] = useState(false);


    const findFolder = (nodes: DriveFolder[], id: string): DriveFolder | null => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findFolder(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const source = findFolder(rootFolders, sourceId ?? "");
    const target = targetId ? { id: targetId, name: NAME_OF[targetId] ?? "Folder" } : null;

    const breadcrumb: string[] = (() => {
        const path: string[] = [];
        let cur: string | undefined = browseId;
        while (cur) {
            path.unshift(cur);
            cur = PARENT_OF[cur];
        }
        if (path[0] !== "root") path.unshift("root");
        return path;
    })();

    const sourceBreadcrumb: string[] = (() => {
        const path: string[] = [];
        let cur: string | undefined = sourceBrowseId;
        while (cur) {
            path.unshift(cur);
            cur = PARENT_OF[cur];
        }
        if (path[0] !== "root") path.unshift("root");
        return path;
    })();

    const handleCreateFolder = async () => {
        const name = prompt("New folder name");
        if (!name) return;

        const parentFolderId = browseId === "root" ? rootFolder?.id : browseId;
        if (!parentFolderId) return;

        setIsFetchingSource(true);
        try {
            const response = await runMacro("createTargetFolder", {
                data: { name, parentFolderId }
            });

            if (response.success) {
                // Load again the folders to make the new folder appear
                const refreshId = browseId === "root" ? rootFolder?.id : browseId;
                const res = await (refreshId === rootFolder?.id ? runMacro("getRootFolders") : runMacro("getChildrenFolders", { data: { id: refreshId } }));

                if (res.success) {
                    if (refreshId === rootFolder?.id) {
                        const updatedRoot = res.data as DriveFolder;
                        queryClient.setQueryData(["rootFolders"], updatedRoot);
                        updatedRoot.children?.forEach(child => {
                            PARENT_OF[child.id] = "root";
                            NAME_OF[child.id] = child.name;
                        });
                    } else {
                        const children = res.data as DriveFolder[];
                        children.forEach(child => {
                            PARENT_OF[child.id] = browseId;
                            NAME_OF[child.id] = child.name;
                        });
                        queryClient.setQueryData<DriveFolder>(["rootFolders"], (oldData) => {
                            if (!oldData) return oldData;
                            const updateTree = (nodes: DriveFolder[]): DriveFolder[] => {
                                return nodes.map(node => {
                                    if (node.id === browseId) {
                                        return { ...node, children };
                                    }
                                    if (node.children) {
                                        return { ...node, children: updateTree(node.children) };
                                    }
                                    return node;
                                });
                            };
                            return { ...oldData, children: updateTree(oldData.children || []) };
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error creating folder", error);
        } finally {
            setIsFetchingSource(false);
        }
    };

    const handleFolderDoubleClick = async (folderId: string, setBrowseId: (id: string) => void) => {
        setBrowseId(folderId);
        const folder = findFolder(rootFolders, folderId);
        if (folder && !folder.children) {
            setIsFetchingSource(true);
            try {
                const response = await runMacro("getChildrenFolders", { data: { id: folderId } });
                if (response.success) {
                    const children = response.data as DriveFolder[];
                    children.forEach(child => {
                        PARENT_OF[child.id] = folderId;
                        NAME_OF[child.id] = child.name;
                    });
                    queryClient.setQueryData<DriveFolder>(["rootFolders"], (oldData) => {
                        if (!oldData) return oldData;
                        const updateTree = (nodes: DriveFolder[]): DriveFolder[] => {
                            return nodes.map(node => {
                                if (node.id === folderId) {
                                    return { ...node, children };
                                }
                                if (node.children) {
                                    return { ...node, children: updateTree(node.children) };
                                }
                                return node;
                            });
                        };
                        return { ...oldData, children: updateTree(oldData.children || []) };
                    });
                }
            } catch (error) {
                console.error("Error fetching children", error);
            } finally {
                setIsFetchingSource(false);
            }
        }
    };

    const handleStartCopying = async () => {
        if (!source || !target) return;

        setStatus("running");
        try {
            const response = await runMacro("startDuplication", {
                data: {
                    sourceFolder: { id: source.id, name: source.name },
                    targetFolder: {
                        id: target.id === "root" ? rootFolder?.id : target.id,
                        name: target.name
                    }
                }
            });

            if (response.success) {
                setStatus("done");
            } else {
                setStatus("idle");
            }
        } catch (error) {
            console.error("Error starting duplication:", error);
            setStatus("idle");
        }
    };

    const currentStep1Folder = sourceBrowseId === "root" ? null : findFolder(rootFolders, sourceBrowseId);
    const step1FoldersList = sourceBrowseId === "root" ? rootFolders : (currentStep1Folder?.children || []);

    const currentStep2Folder = browseId === "root" ? null : findFolder(rootFolders, browseId);
    const step2FoldersList = browseId === "root" ? rootFolders : (currentStep2Folder?.children || []);





    const reset = () => {
        setStep(1);
        setSourceId(null);
        setBrowseId("root");
        setTargetId("root");
        setStatus("idle");
    };

    const canNext = step === 1 ? !!source : step === 2 ? !!targetId : false;

    return (
        <div className={cn("flex h-screen flex-col bg-background transition-opacity", isFetchingSource && "pointer-events-none opacity-60")}>
            <TopBar step={step} />

            <main className="flex-1 overflow-hidden">
                <div className="mx-auto flex h-full max-w-80 flex-col px-5 py-5">
                    {step === 1 && (
                        <>
                            <StepHeading
                                eyebrow="Step 1"
                                title="Pick the folder to copy"
                                subtitle="Browse your Drive and pick the folder you want to copy."
                            />


                            <div className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                                {sourceBreadcrumb.map((id, idx) => (
                                    <span key={id} className="flex items-center gap-1">
                                        {idx > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                                        <button
                                            onClick={() => setSourceBrowseId(id)}
                                            className={cn(
                                                "rounded-md px-1.5 py-0.5 hover:bg-accent",
                                                idx === sourceBreadcrumb.length - 1 && "font-medium text-foreground"
                                            )}
                                        >
                                            {id === "root" ? (
                                                <span className="inline-flex items-center gap-1">
                                                    <Home className="h-3.5 w-3.5" />
                                                    My Drive
                                                </span>
                                            ) : (
                                                NAME_OF[id]
                                            )}
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <ScrollArea className="-mx-1 flex-1 min-h-0" type="always">
                                <div className="flex flex-col gap-2 px-1 pb-4 max-w-67">
                                    {isLoading || isFetchingSource ? (
                                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                                            Loading folders...
                                        </p>
                                    ) : step1FoldersList.length === 0 ? (
                                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                                            No subfolders here.
                                        </p>
                                    ) : step1FoldersList.map((f) => (
                                        <FolderRow
                                            key={f.id}
                                            folder={f}
                                            selected={sourceId === f.id}
                                            onClick={() => setSourceId(f.id)}
                                            onDoubleClick={() => handleFolderDoubleClick(f.id, setSourceBrowseId)}
                                            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>

                            {source && (
                                <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Folder to be copied:</span>
                                    <span className="font-medium">{source.name}</span>
                                </div>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <StepHeading
                                eyebrow="Step 2"
                                title="Where should we copy it?"
                                subtitle="Now, pick a destination folder."
                            />

                            <div className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                                {breadcrumb.map((id, idx) => (
                                    <span key={id} className="flex items-center gap-1">
                                        {idx > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                                        <button
                                            onClick={() => {
                                                setBrowseId(id);
                                                setTargetId(id);
                                            }}
                                            className={cn(
                                                "rounded-md px-1.5 py-0.5 hover:bg-accent",
                                                idx === breadcrumb.length - 1 && "font-medium text-foreground"
                                            )}
                                        >
                                            {id === "root" ? (
                                                <span className="inline-flex items-center gap-1">
                                                    <Home className="h-3.5 w-3.5" />
                                                    My Drive
                                                </span>
                                            ) : (
                                                NAME_OF[id]
                                            )}
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="mb-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleCreateFolder}
                                >
                                    <FolderPlus className="mr-1.5 h-4 w-4" />
                                    New folder
                                </Button>
                            </div>

                            <ScrollArea className="-mx-1 flex-1 min-h-0" type="always">
                                <div className="flex flex-col gap-2 px-1 pb-4 max-w-67">
                                    {isLoading || isFetchingSource ? (
                                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                                            Loading folders...
                                        </p>
                                    ) : step2FoldersList.length === 0 ? (
                                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                                            No subfolders here.
                                        </p>
                                    ) : step2FoldersList.map((f) => (
                                        <FolderRow
                                            key={f.id}
                                            folder={f}
                                            selected={targetId === f.id}
                                            onClick={() => setTargetId(f.id)}
                                            onDoubleClick={() => handleFolderDoubleClick(f.id, setBrowseId)}
                                            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>

                            {target && (
                                <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Destination:</span>
                                    <span className="font-medium">{target.name}</span>
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <StepHeading
                                eyebrow="Step 3"
                                title="Confirm and copy"
                                subtitle="Review the operation details before starting."
                            />

                            <div className="mb-4 rounded-2xl border bg-card p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Folder className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">Source (folder to be copied)</p>
                                        <p className="truncate text-sm font-medium">{source?.name}</p>
                                    </div>
                                </div>
                                <div className="my-2 ml-5 h-5 w-px bg-border" />
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Folder className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">Target (folder to copy to)</p>
                                        <p className="truncate text-sm font-medium">{target?.name}</p>
                                    </div>
                                </div>
                            </div>


                        </>
                    )}
                </div>
            </main>

            <footer className="border-t bg-card">
                <div className="mx-auto flex max-w-75 gap-2 px-5 py-3">
                    {step > 1 && status !== "running" && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back
                        </Button>
                    )}

                    {step < 3 && (
                        <Button
                            className="flex-1"
                            disabled={!canNext}
                            onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                        >
                            Next
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    )}

                    {step === 3 && status === "idle" && (
                        <Button className="flex-1" onClick={handleStartCopying}>
                            <Play className="mr-1.5 h-4 w-4" />
                            Start copying
                        </Button>
                    )}

                    {step === 3 && status === "running" && (
                        <Button className="flex-1" disabled>
                            Copying…
                        </Button>
                    )}

                    {step === 3 && status === "done" && (
                        <Button className="flex-1" onClick={reset}>
                            <RotateCcw className="mr-1.5 h-4 w-4" />
                            Copy another folder
                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default Index;
