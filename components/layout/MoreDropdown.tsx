import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import more_icon from "@/public/icons/More horizontal.svg";
import styles from "./MoreDropdown.module.css";

interface MoreDropdownProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ open, onClose, anchorRef }) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const menuItems = [
    {
      label: "Request Status",
      icon: "/icons/notifications.svg",
      onClick: () => {
        onClose();
        setTimeout(() => router.push("/site/notification"), 50);
      },
    },
    {
      label: "Create Shelter",
      icon: "/icons/Home.svg",
      onClick: () => {
        onClose();
        setTimeout(() => router.push("/site/shelters/create"), 50);
      },
    },
    { label: "About", icon: "/icons/Explore.svg", onClick: () => { onClose(); setTimeout(() => router.push("/site/about"), 50); } },
    { label: "Settings", icon: "/icons/user.svg", onClick: () => { onClose(); setTimeout(() => router.push("/site/settings"), 50); } },
    {
      label: "Log Out",
      icon: "/icons/More horizontal.svg",
      onClick: () => {
        // Add your logout logic here, e.g., call an auth service then redirect
        onClose();
        setTimeout(() => router.push("/site/auth/login"), 50);
      },
    },
  ];

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <div className={styles.header}>
        <span className={styles.title}>More</span>
        <button className={styles.closeBtn} onClick={onClose}>
          <span style={{ fontSize: 24 }}>&#x2039;</span>
        </button>
      </div>
      <div className={styles.menu}>
        {menuItems.map((item) => (
          <button key={item.label} className={styles.menuItem} onClick={item.onClick}>
            <Image src={item.icon} alt={item.label} width={24} height={24} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoreDropdown;
