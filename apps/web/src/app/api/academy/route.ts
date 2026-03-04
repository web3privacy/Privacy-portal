import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AcademyData, Talk, Course, Guide, RadioTrack, FeaturedDocument, AcceleratorItem } from "@/types/academy";
import { loadAcademyData } from "@/lib/academy";

const ROOT_DIR = process.cwd();
const USER_ACADEMY_FILE = path.join(ROOT_DIR, "data", "academy-user.yaml");

function loadUserAcademy(): AcademyData {
  if (!fs.existsSync(USER_ACADEMY_FILE)) {
    return {
      talks: [],
      courses: [],
      quizes: [],
      guides: [],
      podcasts: [],
      radioTracks: [],
      radioPlaylists: [],
      featuredDocuments: [],
      acceleratorItems: [],
    };
  }
  const content = fs.readFileSync(USER_ACADEMY_FILE, "utf8");
  const parsed = yaml.load(content) as AcademyData | null;
  return parsed ?? {
    talks: [],
    courses: [],
    quizes: [],
    guides: [],
    podcasts: [],
    radioTracks: [],
    radioPlaylists: [],
    featuredDocuments: [],
    acceleratorItems: [],
  };
}

function saveUserAcademy(data: AcademyData): void {
  try {
    // Preserve comments and formatting by using custom options
    const yamlContent = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });
    fs.writeFileSync(USER_ACADEMY_FILE, yamlContent, "utf8");
  } catch (error) {
    console.error("Error saving academy data:", error);
    throw error;
  }
}

export async function GET() {
  // Return merged data (base + user)
  const data = loadAcademyData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loadUserAcademy();
    
    // Handle different content types
    if (body.type === "talk") {
      const talk: Talk = {
        id: body.id || `talk-${Date.now()}`,
        title: body.title,
        description: body.description,
        youtubeId: body.youtubeId,
        thumbnailUrl: body.thumbnailUrl,
        duration: body.duration,
        speaker: body.speaker,
        publishedAt: body.publishedAt,
        viewCount: body.viewCount,
        displayOrder: body.displayOrder,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      data.talks.push(talk);
    } else if (body.type === "course") {
      const course: Course = {
        id: body.id || `course-${Date.now()}`,
        title: body.title,
        description: body.description,
        icon: body.icon,
        url: body.url,
        duration: body.duration,
        level: body.level,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      data.courses.push(course);
    } else if (body.type === "guide") {
      const guide: Guide = {
        id: body.id || `guide-${Date.now()}`,
        title: body.title,
        description: body.description,
        url: body.url,
        duration: body.duration,
        tags: body.tags,
        isNew: body.isNew,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      data.guides.push(guide);
    } else if (body.type === "radioTrack") {
      const track: RadioTrack = {
        id: body.id || `radio-${Date.now()}`,
        title: body.title,
        youtubeId: body.youtubeId,
        thumbnailUrl: body.thumbnailUrl,
        duration: body.duration,
        speaker: body.speaker,
        displayOrder: body.displayOrder,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      data.radioTracks.push(track);
    } else if (body.type === "featuredDocument") {
      const doc: FeaturedDocument = {
        id: body.id || `doc-${Date.now()}`,
        title: body.title,
        description: body.description,
        thumbnailUrl: body.thumbnailUrl,
        url: body.url,
        duration: body.duration,
        publishedAt: body.publishedAt,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      data.featuredDocuments.push(doc);
    } else if (body.type === "acceleratorItem") {
      const item: AcceleratorItem = {
        id: body.id || `accelerator-${Date.now()}`,
        title: body.title,
        description: body.description,
        icon: body.icon,
        url: body.url,
      };
      data.acceleratorItems.push(item);
    }
    
    saveUserAcademy(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving academy item:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = loadUserAcademy();
    const { id, type, ...updates } = body;
    
    if (type === "talk") {
      const index = data.talks.findIndex((t) => t.id === id);
      if (index >= 0) {
        data.talks[index] = { ...data.talks[index], ...updates };
      }
    } else if (type === "course") {
      const index = data.courses.findIndex((c) => c.id === id);
      if (index >= 0) {
        data.courses[index] = { ...data.courses[index], ...updates };
      }
    } else if (type === "guide") {
      const index = data.guides.findIndex((g) => g.id === id);
      if (index >= 0) {
        data.guides[index] = { ...data.guides[index], ...updates };
      }
    } else if (type === "radioTrack") {
      const index = data.radioTracks.findIndex((r) => r.id === id);
      if (index >= 0) {
        data.radioTracks[index] = { ...data.radioTracks[index], ...updates };
      }
    } else if (type === "featuredDocument") {
      const index = data.featuredDocuments.findIndex((d) => d.id === id);
      if (index >= 0) {
        data.featuredDocuments[index] = { ...data.featuredDocuments[index], ...updates };
      }
    } else if (type === "acceleratorItem") {
      const index = data.acceleratorItems.findIndex((a) => a.id === id);
      if (index >= 0) {
        data.acceleratorItems[index] = { ...data.acceleratorItems[index], ...updates };
      }
    } else if (type === "reorder") {
      // Handle reordering of talks or radio tracks
      if (body.contentType === "talks") {
        body.items.forEach((item: { id: string; displayOrder: number }) => {
          const index = data.talks.findIndex((t) => t.id === item.id);
          if (index >= 0) {
            data.talks[index].displayOrder = item.displayOrder;
          }
        });
      } else if (body.contentType === "radioTracks") {
        body.items.forEach((item: { id: string; displayOrder: number }) => {
          const index = data.radioTracks.findIndex((r) => r.id === item.id);
          if (index >= 0) {
            data.radioTracks[index].displayOrder = item.displayOrder;
          }
        });
      }
    }
    
    saveUserAcademy(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating academy item:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    
    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }
    
    const data = loadUserAcademy();
    
    if (type === "talk") {
      data.talks = data.talks.filter((t) => t.id !== id);
    } else if (type === "course") {
      data.courses = data.courses.filter((c) => c.id !== id);
    } else if (type === "guide") {
      data.guides = data.guides.filter((g) => g.id !== id);
    } else if (type === "radioTrack") {
      data.radioTracks = data.radioTracks.filter((r) => r.id !== id);
    } else if (type === "featuredDocument") {
      data.featuredDocuments = data.featuredDocuments.filter((d) => d.id !== id);
    } else if (type === "acceleratorItem") {
      data.acceleratorItems = data.acceleratorItems.filter((a) => a.id !== id);
    }
    
    saveUserAcademy(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting academy item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
