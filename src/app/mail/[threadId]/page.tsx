import ThreadList from "@/components/ThreadList";
import ThreadDetail from "@/components/ThreadDetail";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return (
    <div className="flex h-full">
      <div className="hidden w-96 shrink-0 overflow-y-auto border-r border-zinc-100 lg:block">
        <ThreadList activeThreadId={threadId} />
      </div>
      <div className="min-w-0 flex-1">
        <ThreadDetail key={threadId} threadId={threadId} />
      </div>
    </div>
  );
}
