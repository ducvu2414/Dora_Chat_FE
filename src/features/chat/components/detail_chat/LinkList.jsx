/* eslint-disable react/prop-types */
import Link from "@assets/chat/link_list.svg";

export default function LinkList({ limit, links }) {
  function getDomainName(url) {
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    domain = domain.split(/[/?#]/)[0];
    return domain;
  }

  function removeProtocol(url) {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  }

  const linksHandle = links?.map((item) => {
    return {
      name: getDomainName(item.content),
      link: removeProtocol(item.content),
    };
  });

  const displayedLinks = limit ? linksHandle.slice(0, limit) : linksHandle;
  return (
    <ul className="px-4 mt-2">
      {displayedLinks.map((file, index) => (
        <li
          key={index}
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
          target="_blank"
          onClick={() => {
            window.open(
              file.link.startsWith("http") ? file.link : `https://${file.link}`,
              "_blank"
            );
          }}
        >
          <img src={Link} alt="icon" className="p-3 bg-white rounded-md" />
          <div>
            <p className="text-sm font-medium text-start">{file.name}</p>
            <p className="text-xs text-[#086DC0] font-light text-start">
              {file.link.length > 15
                ? file.link.slice(0, 37) + "..."
                : file.link}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
