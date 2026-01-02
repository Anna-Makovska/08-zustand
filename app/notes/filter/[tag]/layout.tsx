import type { ReactNode } from "react";
import css from "./layout.module.css";

interface FilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export default function FilterLayout({
  children,
  sidebar,
  modal,
}: FilterLayoutProps) {
  return (
    <>
      <div className={css.container}>
        <div className={css.sidebar}>{sidebar}</div>
        <div className={css.notesWrapper}>{children}</div>
      </div>
      {modal}
    </>
  );
}
