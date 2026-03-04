import { NextResponse } from "next/server";
import {
  getLikeCountsForStacks,
  getDataFiles,
  loadLikesFile,
  loadYamlData,
  loadUserSubmittedData,
  mergeTools,
  savePopularToolsFile,
  saveUserSubmittedData,
} from "@/lib/data";
import { getMostPopularTools } from "@/lib/stacks-view";
import type { Stack, Tools } from "@/types";

type SubmitProfilePayload = {
  stack: Stack;
  toolsPatch: Tools;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidTools(value: unknown): value is Tools {
  if (!isRecord(value)) {
    return false;
  }

  for (const categoryValue of Object.values(value)) {
    if (!isRecord(categoryValue)) {
      return false;
    }
    for (const detail of Object.values(categoryValue)) {
      if (!isRecord(detail)) {
        return false;
      }
      if (typeof detail.name !== "string" || typeof detail.url !== "string") {
        return false;
      }
      if (detail.image !== undefined && typeof detail.image !== "string") {
        return false;
      }
    }
  }

  return true;
}

function isValidStack(value: unknown): value is Stack {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.org === "string" &&
    typeof value.avatar === "string" &&
    isRecord(value.tools)
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SubmitProfilePayload;

    if (!isValidStack(payload?.stack) || !isValidTools(payload?.toolsPatch)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const files = getDataFiles();
    const baseData = loadYamlData(files.base);
    const submittedData = loadUserSubmittedData();
    const nextSubmittedTools = mergeTools(submittedData.tools, payload.toolsPatch);
    const nextSubmittedStacks = {
      ...submittedData.stacks,
      [payload.stack.id]: payload.stack,
    };

    saveUserSubmittedData({
      tools: nextSubmittedTools,
      stacks: nextSubmittedStacks,
    });

    const mergedTools = mergeTools(baseData.tools, nextSubmittedTools);
    const mergedStacks = {
      ...baseData.stacks,
      ...nextSubmittedStacks,
    };
    const mergedStackList = [
      payload.stack,
      ...Object.values(mergedStacks).filter((stack) => stack.id !== payload.stack.id),
    ];
    const popularTools = getMostPopularTools(mergedTools, mergedStackList, 10);
    const likeCounts = getLikeCountsForStacks(mergedStacks, loadLikesFile());

    savePopularToolsFile(popularTools);

    return NextResponse.json({
      tools: mergedTools,
      stacks: mergedStackList,
      popularTools,
      likeCounts,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
