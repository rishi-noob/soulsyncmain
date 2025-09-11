"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Video } from "lucide-react";

const articles = [
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
]

const videos = [
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
]


export default function ResourcesPage() {

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">Curated articles and videos to support your mental well-being.</p>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            Helpful Articles
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <a href={article.url} target="_blank" rel="noopener noreferrer" key={index} className="block">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Watch & Learn
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
               <Card key={index}>
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
                    <CardHeader>
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription>{video.creator}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
