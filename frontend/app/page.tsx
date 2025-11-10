import "@copilotkit/react-ui/styles.css";
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <main>
      <h1>Gyanvarta</h1>
      <CopilotSidebar
        labels={{
          title: "Gyanvarta Assistant",
          initial: "Hi! I'm connected to gyanvarta agent. What topic do you want to research?",
        }}
      />
    </main>
  );
}