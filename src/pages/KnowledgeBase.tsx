import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, FileText, ChevronRight, Upload, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function KnowledgeBase() {
  const { folders, documents } = useAppStore();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const rootFolders = folders.filter(f => !f.parentId);
  const getSubfolders = (parentId: string) => folders.filter(f => f.parentId === parentId);
  const getFolderDocs = (folderId: string) => documents.filter(d => d.folderId === folderId);
  const selectedDocument = documents.find(d => d.id === selectedDoc);

  const filteredDocs = search ? documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) : [];

  return (
    <div className="p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Knowledge Base</h1>
        <Button><Upload className="w-4 h-4 mr-2" />Upload</Button>
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
        {/* Folder Tree */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Folder className="w-4 h-4" />Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {rootFolders.map(folder => (
              <div key={folder.id}>
                <button onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-left">
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedFolder === folder.id ? 'rotate-90' : ''}`} />
                  <Folder className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{folder.name}</span>
                </button>
                {selectedFolder === folder.id && (
                  <div className="ml-6 space-y-1">
                    {getSubfolders(folder.id).map(sub => (
                      <button key={sub.id} onClick={() => setSelectedFolder(sub.id)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-left">
                        <Folder className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{sub.name}</span>
                        <Badge variant="secondary" className="ml-auto text-[10px]">{getFolderDocs(sub.id).length}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" />Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(selectedFolder ? getFolderDocs(selectedFolder) : documents.slice(0, 10)).map(doc => (
              <button key={doc.id} onClick={() => setSelectedDoc(doc.id)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 text-left">
                <FileText className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()} • {doc.size} • Updated {format(doc.lastUpdated, 'MMM d')}</p>
                  <div className="flex gap-1 mt-1">{doc.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
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
    </div>
  );
}
