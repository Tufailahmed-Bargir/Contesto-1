import React from "react";

const avatarImages = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1627161683077-e34782c24d81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80",
];

const UserAvatars = () => {
  return (
    <div className="avatar-stack flex items-center">
      {avatarImages.map((src, idx) => (
        <Avatar key={idx} src={src} index={idx} />
      ))}
    </div>
  );
};

const Avatar = ({ src, index }: { src: string; index: number }) => {
  return (
    <div
      className="h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 transition-transform hover:z-10"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <img
        src={src}
        alt={`User ${index + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
        style={{
          animationDelay: `${index * 0.1}s`,
          transition: "all 0.3s ease",
        }}
      />
    </div>
  );
};

export default UserAvatars;
