import React, {useState, useEffect} from 'react';
import PageTitle from '../Components/Reusable/PageTitle';
import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
// import { Image } from '@/Components/Reusable/Media';
// import { Video } from '@/Components/Reusable/Media';
import Example from '../Layouts/DashboardLayoutNew';
// import { Filter } from '@/Components/Reusable/Media';
import './css/StaffDirectory.css';
import '../Components/Reusable/css/FileManagementSearchBar.css'




const Media = () => {
    // const [selectedMedia, setSelectedMedia] = useState('All');
    const [posts, setPosts] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const url = 'http://localhost:8000/api/crud/posts';
        const options = {
          method: 'GET',
          headers: { Accept: 'application/json' }
        };
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          setPosts(data.data.data);
          // Extract unique tag values
          const uniqueTags = [...new Set(data.data.data.flatMap(post => post.tag || []))];
          setTagOptions(uniqueTags);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);

    useEffect(() => {
      if (selectedTag === '') {
        setFilteredPosts(posts);
      } else {
        setFilteredPosts(posts.filter(post => post.tag && post.tag.includes(selectedTag)));
      }
    }, [selectedTag, posts]);

    const handleTagChange = (event) => {
      setSelectedTag(event.target.value);
    };

    const renderImages = () => {
      return filteredPosts.map(post => (
        post.attachments.filter(attachment => attachment.mime_type.startsWith('image/')).map(imageAttachment => (
          <img key={imageAttachment.id} src={`http://localhost:8000/storage/${imageAttachment.path}`} alt="Image Attachment" className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover"/>
        ))
      ));
    };

    const renderVideos = () => {
      return filteredPosts.map(post => (
        post.attachments.filter(attachment => attachment.mime_type.startsWith('video/')).map(videoAttachment => (
          <video key={videoAttachment.id} controls src={`http://localhost:8000/storage/${videoAttachment.path}`} className="grow shrink-0 max-w-full aspect-[1.19] w-full"/>
        ))
      ));
    };

    // const menuItems = [
    //     'All',
    //     'TM Networking Day',
    //     'Peraduan Jomla!',
    // ];

    // const handleSelectMedia = (menuItem) => {
    //     setSelectedMedia(menuItem);
    //   };


  return (
    <Example>
    <main className="xl:pl-96">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <div>
            <div className="flex flex-col justify-center text-sm max-w-full text-neutral-800 relative">
      <div
        style={{ width: '180px' }}
        className="flex gap-5 justify-between px-4 py-3 bg-white rounded-2xl shadow-lg cursor-pointer"
      >
                <select value={selectedTag} onChange={handleTagChange}>
                    <option value="">All</option>
                    {tagOptions.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                    ))}
                </select>
                </div>
                </div>
                <div>
                    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                        <header>
                            <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
                            Images
                            </h1>
                            <hr className="underline" />
                        </header>
                        <section className="mt-8 max-md:max-w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {/* <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">Images</h1> */}
                                    {renderImages()}
                            </div>
                        </section>
                    </section>
                </div>
                <div>
                    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                        <header>
                            <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
                            Videos
                            </h1>
                            <hr className="underline" />
                        </header>
                        <section className="mt-8 max-md:max-w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {/* <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">Images</h1> */}
                                    {renderVideos()}
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </div>
    </main>
    <aside className="fixed bottom-0 left-20 top-16 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        <style>
            {`
            aside::-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
            `}
        </style>
        <div className="file-directory-header">
          <PageTitle title="Media" />
        </div>
        <hr className="file-directory-underline" />

        <div>
            <FeaturedEvents />
            <WhosOnline />
        </div>
    </aside>
    </Example>
  );
};

export default Media;
