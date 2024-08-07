import React, { useEffect, useState } from "react";

const VideoComponent = ({ src, alt, className }) => (
  <video controls className={className}>
    <source src={src} type="video/mp4" />
    {alt}
  </video>
);

function Video({ selectedItem }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/crud/resources")
      .then((response) => response.json())
      .then((data) => {
        const videoPaths = data.data.data
          .filter((item) => {
            // Check if the item is a video, you can adjust the condition based on your API response
            const fileExtension = item.path.split('.').pop().toLowerCase();
            return ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'].includes(fileExtension);
          })
          .map((item) => ({
            src: `/storage/${item.path}`,
            alt: `Description ${item.id}`,
            category: item.attachable_type // Adjust as per your condition
          }));
        setVideos(videoPaths);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  // Filter videos based on selectedItem
  const filteredVideos = selectedItem === 'All' ? videos : videos.filter(video => video.category === selectedItem);

  return (
    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
      <header>
        <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
          Videos
        </h1>
        <hr className="underline" />
      </header>
      <section className="mt-8 max-md:max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <figure key={index} className="flex flex-col">
                <VideoComponent
                  src={video.src}
                  alt={video.alt}
                  className="grow shrink-0 max-w-full aspect-[1.19] w-full"
                />
              </figure>
            ))
          ) : (
            <p>No Videos available...</p>
          )}
        </div>
      </section>
    </section>
  );
}

export default Video;
