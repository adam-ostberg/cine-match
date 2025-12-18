import Avatar from "boring-avatars";

type UserAvatarProps = {
  userId: string;
  // Allow parent to style it
  className?: string;
  size?: number;
}

export function UserAvatar(props: UserAvatarProps) {
  const colors = ["#51b351", "#2a5c2a", "#85e085", "#f0fff0", "#142e14"];

  return (
    <div className={`profile-pic ${props.className ? props.className : ""}`}>
      <Avatar
        size={props.size ? props.size : 40}
        name={props.userId}
        variant="beam"
        colors={colors}
      />
    </div>
  );
}