import Link from "next/link";
import css from "./SidebarNotes.module.css";

const TAGS = ["All notes", "Todo", "Work", "Personal", "Shopping"];

export default function SidebarNotes() {
  return (
    <aside>
      <ul className={css.menuList}>
        {TAGS.map((tag) => {
          const href =
            tag === "All notes" ? "/notes/filter/all" : `/notes/filter/${tag}`;

          return (
            <li key={tag} className={css.menuItem}>
              <Link href={href} className={css.menuLink}>
                {tag}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
