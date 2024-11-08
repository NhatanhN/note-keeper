import styles from "./page.module.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";

export default function Home() {
  return (
    <div className={styles.widescreenOrganization}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.noteEditor}>
        <NoteEditor />
      </div>
    </div>
  );
}
