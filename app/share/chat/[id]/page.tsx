export interface SharePageProps {
  params: {
    id: string;
  };
}

export const runtime = "edge";

export default async function SharePage({ params }: SharePageProps) {
  return <div> share page</div>;
}
