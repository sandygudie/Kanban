import React from "react";

interface Props {
  ele: {
    _id: string;
    url: string;
    name: string;
    addDate: string;
    type: string;
  };
}

export default function ViewAttachment({ ele }: Props) {
  return (
    <div className="w-full h-full">
      {ele.type === "image" ? (
        <img src={ele.url} width="100%" height="100%" alt={ele.name} />
      ) : (
        <iframe
          title={ele.name}
          src={ele.url}
          className="h-[36rem]"
          width="100%"
          height="100%"
        ></iframe>
      )}
    </div>
  );
}
