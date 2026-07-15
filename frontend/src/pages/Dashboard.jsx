import Sidebar from "../components/Mainbar";
import TaskCard from "../components/Foreground";
import TaskDetails from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="container">

      <Sidebar />

      <main className="task-list">

        <h1>GOALS</h1>

        <TaskCard />
        <TaskCard />
        <TaskCard />

      </main>

      <TaskDetails />

    </div>
  );
}