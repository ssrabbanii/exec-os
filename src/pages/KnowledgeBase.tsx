import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { Folder, FileText, ChevronRight, ChevronDown, Upload, Search, Eye, Plus, FolderPlus, FilePlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Document, Folder as FolderType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function KnowledgeBase() {
  const { folders, documents, addFolder, addDocument } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Dialogs
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [parentFolderIdForNew, setParentFolderIdForNew] = useState<string | undefined>(undefined);

  const rootFolders = folders.filter(f => !f.parentId);
  const getSubfolders = (parentId: string) => folders.filter(f => f.parentId === parentId);
  const getFolderDocs = (folderId: string) => documents.filter(d => d.folderId === folderId);
  const selectedDocument = documents.find(d => d.id === selectedDoc);

  const filteredDocs = search ? documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) : [];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
    setSelectedFolderId(folderId);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const folder: FolderType = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      parentId: parentFolderIdForNew
    };
    
    addFolder(folder);
    setNewFolderName('');
    setIsNewFolderDialogOpen(false);
    setParentFolderIdForNew(undefined);
    
    // Expand parent folder if creating a subfolder
    if (parentFolderIdForNew) {
      setExpandedFolders(prev => new Set(prev).add(parentFolderIdForNew));
    }
    
    toast({ title: 'Folder created', description: `"${folder.name}" has been created.` });
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    const document: Document = {
      id: `doc-${Date.now()}`,
      title: newFileName,
      type: 'txt',
      folderId: parentFolderIdForNew,
      lastUpdated: new Date(),
      size: '0 KB',
      preview: 'Empty document',
      tags: [],
      linkedContacts: []
    };
    
    addDocument(document);
    setNewFileName('');
    setIsNewFileDialogOpen(false);
    setParentFolderIdForNew(undefined);
    
    toast({ title: 'File created', description: `"${document.title}" has been created.` });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const type = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'].includes(extension) ? extension as Document['type'] : 'txt';
      
      const document: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        type,
        folderId: selectedFolderId || undefined,
        lastUpdated: new Date(),
        size: formatFileSize(file.size),
        preview: `Uploaded file: ${file.name}`,
        tags: [],
        linkedContacts: []
      };
      
      addDocument(document);
    });
    
    toast({ 
      title: 'Files uploaded', 
      description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.` 
    });
    
    // Reset file input
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openNewFolderDialog = (parentId?: string) => {
    setParentFolderIdForNew(parentId);
    setIsNewFolderDialogOpen(true);
  };

  const openNewFileDialog = (folderId?: string) => {
    setParentFolderIdForNew(folderId);
    setIsNewFileDialogOpen(true);
  };

  // Recursive folder tree component
  const FolderTreeItem = ({ folder, depth = 0 }: { folder: FolderType; depth?: number }) => {
    const subfolders = getSubfolders(folder.id);
    const folderDocs = getFolderDocs(folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div>
        <ContextMenu>
          <ContextMenuTrigger>
            <button 
              onClick={() => toggleFolder(folder.id)} 
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-left transition-colors",
                isSelected && "bg-primary/10 hover:bg-primary/15"
              )}
              style={{ paddingLeft: `${8 + depth * 16}px` }}
            >
              {subfolders.length > 0 || folderDocs.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )
              ) : (
                <div className="w-4" />
              )}
              <Folder className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
              <span className="text-sm font-medium flex-1 truncate">{folder.name}</span>
              {(subfolders.length > 0 || folderDocs.length > 0) && (
                <Badge variant="secondary" className="text-[10px] ml-auto">{subfolders.length + folderDocs.length}</Badge>
              )}
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => openNewFileDialog(folder.id)}>
              <FilePlus className="w-4 h-4 mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={() => openNewFolderDialog(folder.id)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        {isExpanded && (
          <div className="animate-fade-in">
            {subfolders.map(sub => (
              <FolderTreeItem key={sub.id} folder={sub} depth={depth + 1} />
            ))}
            {folderDocs.map(doc => (
              <button 
                key={doc.id} 
                onClick={() => setSelectedDoc(doc.id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-left"
                style={{ paddingLeft: `${8 + (depth + 1) * 16}px` }}
              >
                <div className="w-4" />
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Knowledge Base</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openNewFileDialog(selectedFolderId || undefined)}>
                <FilePlus className="w-4 h-4 mr-2" />
                New File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openNewFolderDialog()}>
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />Upload
          </Button>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents, tags..." className="pl-10" />
      </div>

      {search && filteredDocs.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Search Results ({filteredDocs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredDocs.map(doc => (
              <button key={doc.id} onClick={() => setSelectedDoc(doc.id)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 text-left">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <div className="flex gap-1 mt-1">{doc.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Folder Tree - VS Code style */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Folder className="w-4 h-4" />Explorer
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openNewFileDialog(selectedFolderId || undefined)}>
                  <FilePlus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openNewFolderDialog()}>
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {rootFolders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No folders yet</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => openNewFolderDialog()}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create folder
                </Button>
              </div>
            ) : (
              rootFolders.map(folder => (
                <FolderTreeItem key={folder.id} folder={folder} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
              {selectedFolderId && (
                <Badge variant="outline" className="ml-2 text-[10px]">
                  {folders.find(f => f.id === selectedFolderId)?.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(selectedFolderId ? getFolderDocs(selectedFolderId) : documents.slice(0, 10)).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents in this folder</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => openNewFileDialog(selectedFolderId || undefined)}>
                    <FilePlus className="w-4 h-4 mr-2" />
                    New file
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleUploadClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            ) : (
              (selectedFolderId ? getFolderDocs(selectedFolderId) : documents.slice(0, 10)).map(doc => (
                <button key={doc.id} onClick={() => setSelectedDoc(doc.id)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 text-left transition-colors">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()} • {doc.size} • Updated {format(doc.lastUpdated, 'MMM d')}</p>
                    <div className="flex gap-1 mt-1">{doc.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                  </div>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Preview Sheet */}
      <Sheet open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedDocument?.title}</SheetTitle>
          </SheetHeader>
          {selectedDocument && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-2">{selectedDocument.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm">{selectedDocument.preview}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Type: {selectedDocument.type.toUpperCase()}</p>
                <p>Size: {selectedDocument.size}</p>
                <p>Last updated: {format(selectedDocument.lastUpdated, 'MMMM d, yyyy')}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              {parentFolderIdForNew 
                ? `Creating folder inside "${folders.find(f => f.id === parentFolderIdForNew)?.name}"`
                : 'Create a new folder in the root directory'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input 
              id="folder-name" 
              placeholder="e.g., Meeting Notes" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New File Dialog */}
      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              {parentFolderIdForNew 
                ? `Creating file in "${folders.find(f => f.id === parentFolderIdForNew)?.name}"`
                : 'Create a new file'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="file-name">File Name</Label>
            <Input 
              id="file-name" 
              placeholder="e.g., notes.txt" 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}