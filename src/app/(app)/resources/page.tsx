"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Video, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Article = {
  title: string;
  source: string;
  url: string;
  description: string;
};

type Video = {
  title: string;
  creator: string;
  url: string;
};

const initialArticles: Article[] = [
  {
    title: "Understanding Anxiety and How to Cope",
    source: "National Institute of Mental Health",
    url: "#",
    description: "An in-depth look at anxiety disorders, their symptoms, and effective coping strategies."
  },
  {
    title: "The Importance of Sleep for Mental Well-being",
    source: "Sleep Foundation",
    url: "#",
    description: "Learn how sleep impacts your mental health and get tips for a better night's rest."
  },
  {
    title: "Mindfulness for Beginners: A Guide to the Present Moment",
    source: "Mindful.org",
    url: "#",
    description: "A practical introduction to mindfulness meditation and its benefits for reducing stress."
  }
];

const initialVideos: Video[] = [
  {
    title: "Guided Meditation for Stress Relief (10 Minutes)",
    creator: "Goodful",
    url: "https://www.youtube.com/embed/_45n06x8x2I",
  },
  {
    title: "How to Deal with Burnout",
    creator: "TED",
    url: "https://www.youtube.com/embed/o_3s629-pfg",
  },
   {
    title: "A Simple Trick to Improve Social Skills",
    creator: "Charisma on Command",
    url: "https://www.youtube.com/embed/s3C_l1_leQA",
  },
];

export default function ResourcesPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  const canEdit = role === 'admin' || role === 'volunteer';

  // State for dialogs
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [currentVideo, setCurrentVideo] = useState<Partial<Video>>({});

  const openArticleDialog = (article: Article | null = null) => {
    setEditingArticle(article);
    setCurrentArticle(article || {});
    setIsArticleDialogOpen(true);
  };

  const openVideoDialog = (video: Video | null = null) => {
    setEditingVideo(video);
    setCurrentVideo(video || {});
    setIsVideoDialogOpen(true);
  };

  const handleSaveArticle = () => {
    if (!currentArticle.title || !currentArticle.source || !currentArticle.url || !currentArticle.description) {
        toast({ variant: 'destructive', title: 'Please fill all fields' });
        return;
    }
    if (editingArticle) {
        setArticles(articles.map(a => a.title === editingArticle.title ? currentArticle as Article : a));
        toast({ title: "Article updated!" });
    } else {
        setArticles([currentArticle as Article, ...articles]);
        toast({ title: "Article added!" });
    }
    setIsArticleDialogOpen(false);
  };

  const handleSaveVideo = () => {
    if (!currentVideo.title || !currentVideo.creator || !currentVideo.url) {
        toast({ variant: 'destructive', title: 'Please fill all fields' });
        return;
    }
    if (editingVideo) {
        setVideos(videos.map(v => v.title === editingVideo.title ? currentVideo as Video : v));
        toast({ title: "Video updated!" });
    } else {
        setVideos([currentVideo as Video, ...videos]);
        toast({ title: "Video added!" });
    }
    setIsVideoDialogOpen(false);
  };
  
  const handleDeleteArticle = (articleTitle: string) => {
    setArticles(articles.filter(a => a.title !== articleTitle));
    toast({ title: "Article removed." });
  }

  const handleDeleteVideo = (videoTitle: string) => {
    setVideos(videos.filter(v => v.title !== videoTitle));
    toast({ title: "Video removed." });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">Curated articles and videos to support your mental well-being.</p>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-primary" />
              Helpful Articles
            </h2>
            {canEdit && <Button onClick={() => openArticleDialog()}><PlusCircle className="mr-2"/> Add Article</Button>}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card key={index} className="h-full flex flex-col">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block flex-grow">
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                </a>
                {canEdit && (
                  <div className="p-2 flex justify-end gap-2 border-t mt-auto">
                    <Button variant="ghost" size="sm" onClick={() => openArticleDialog(article)}><Edit className="mr-1"/> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteArticle(article.title)}><Trash2 className="mr-1"/> Delete</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section>
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Watch & Learn
              </h2>
              {canEdit && <Button onClick={() => openVideoDialog()}><PlusCircle className="mr-2"/> Add Video</Button>}
            </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
               <Card key={index} className="flex flex-col">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                         <iframe
                            src={video.url}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <CardHeader className="flex-grow">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription>{video.creator}</CardDescription>
                    </CardHeader>
                    {canEdit && (
                      <div className="p-2 flex justify-end gap-2 border-t">
                        <Button variant="ghost" size="sm" onClick={() => openVideoDialog(video)}><Edit className="mr-1"/> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteVideo(video.title)}><Trash2 className="mr-1"/> Delete</Button>
                      </div>
                    )}
                </Card>
            ))}
          </div>
        </section>
      </div>

       {/* Article Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingArticle ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" value={currentArticle.title || ''} onChange={(e) => setCurrentArticle(p => ({...p, title: e.target.value}))} className="col-span-3"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">Source</Label>
                    <Input id="source" value={currentArticle.source || ''} onChange={(e) => setCurrentArticle(p => ({...p, source: e.target.value}))} className="col-span-3"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">URL</Label>
                    <Input id="url" value={currentArticle.url || ''} onChange={(e) => setCurrentArticle(p => ({...p, url: e.target.value}))} className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right mt-2">Description</Label>
                    <Textarea id="description" value={currentArticle.description || ''} onChange={(e) => setCurrentArticle(p => ({...p, description: e.target.value}))} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSaveArticle}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="video-title" className="text-right">Title</Label>
                    <Input id="video-title" value={currentVideo.title || ''} onChange={(e) => setCurrentVideo(p => ({...p, title: e.target.value}))} className="col-span-3"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="creator" className="text-right">Creator</Label>
                    <Input id="creator" value={currentVideo.creator || ''} onChange={(e) => setCurrentVideo(p => ({...p, creator: e.target.value}))} className="col-span-3"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="video-url" className="text-right">Embed URL</Label>
                    <Input id="video-url" value={currentVideo.url || ''} onChange={(e) => setCurrentVideo(p => ({...p, url: e.target.value}))} className="col-span-3" placeholder="https://youtube.com/embed/..."/>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSaveVideo}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
