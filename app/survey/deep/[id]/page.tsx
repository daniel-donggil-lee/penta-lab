import DeepSurveyPage from "./DeepSurveyClient";

const RESPONDENT_IDS = ["dalcom-kim"];

export function generateStaticParams() {
  return RESPONDENT_IDS.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DeepSurveyPage params={{ id }} />;
}
