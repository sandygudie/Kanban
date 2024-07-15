import { useState, useRef } from "react";
import './style.css'
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";
import { AppState } from "types";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";

const NotificationFeed = () => {
  const data: AppState = useSelector(appData);
  const { user } = data;
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  if (!user) return null;

  return (
    <KnockProvider
      apiKey={String(import.meta.env.VITE_PUBLIC_KNOCK_API_KEY)}
      userId={user.id}
    >
      <KnockFeedProvider feedId={String(import.meta.env.VITE_PUBLIC_KNOCK_FEED_ID)}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default NotificationFeed;
