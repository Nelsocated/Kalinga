import WebTemplate from "@/src/components/template/WebTemplate";
import CreationPageView from "@/src/components/views/CreationPageView";

export default function Page() {
  return <WebTemplate header="Create" main={<CreationPageView />} />;
}
