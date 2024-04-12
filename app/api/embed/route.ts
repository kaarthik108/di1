// @ts-nocheck
import { db } from "@/app/bindings";
import { Document } from "@langchain/core/documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { createEmbeddings, sendToCloudflare } from "../../actions";
// export const runtime = "edge";

async function embedDocument(doc: any) {
  try {
    const text = doc.pageContent;
    const hash = md5(text);

    // Check if the document already exists in the database
    const selectStmt = db.prepare("SELECT * FROM v_yc WHERE hash = ?");
    const stmt = await selectStmt.bind(hash).all();

    if (stmt.results.length > 0) {
      const existingRecord = stmt.results[0];
      console.log("existingRecord", existingRecord);

      return {
        id: existingRecord.id,
        values: [],
        alreadyExists: true,
      };
    }
    // Generate embeddings for the document
    const embeddings = await createEmbeddings(text);
    if (embeddings?.length !== 1024) {
      throw new Error(
        `Unexpected vector length: ${embeddings?.length}. Expected 1024.`
      );
    }

    // Insert new document into the database
    const result = await db
      .prepare("INSERT INTO v_yc (hash, text) VALUES (?, ?) RETURNING id")
      .bind(hash, text)
      .all<{ id: number }>();

    const { id } = result.results[0];

    return {
      id: id.toString(),
      values: embeddings,
      alreadyExists: false,
    };
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}
async function prepareDocument(page: any) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 0,
  });
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
    }),
  ]);
  return docs;
}

export async function GET(req: Request) {
  // this should only run on developement

  if (process.env.NODE_ENV !== "development") {
    return new Response("Not Found", { status: 404 });
  }

  try {
    // const data = await downloadFromR2("KAARTHIK_ai_engineer.pdf");
    const data = new DirectoryLoader("documents/", {
      ".txt": (path: string) => new TextLoader(path),
    });
    const docs = await data.load();
    // console.log("docs", docs);
    const documents = await Promise.all(docs.map(prepareDocument));
    const vectors = await Promise.all(documents.flat().map(embedDocument));
    // console.log("vectors", vectors);
    if (vectors.length === 0) {
      console.log("No documents found.");
      return new Response(JSON.stringify("No documents found."), {
        headers: { "content-type": "application/json" },
      });
    }

    const newVectors = vectors
      .filter(
        (vector) =>
          vector && !vector.alreadyExists && vector.values !== undefined
      )
      .map((vector) => ({
        id: vector.id as string,
        values: vector.values as number[],
      }));

    console.log(newVectors);

    if (newVectors.length > 0) {
      console.log("Sending new vectors to Cloudflare...");
      // await sendToCloudflare(newVectors);
      return new Response(JSON.stringify("Sent new vectors to Cloudflare."), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify("No new vectors to send to Cloudflare."),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "content-type": "application/json" },
    });
  }
}
