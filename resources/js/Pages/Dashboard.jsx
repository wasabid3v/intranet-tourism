import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import PageTitle from '../Components/Reusable/PageTitle';
import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
import './css/StaffDirectory.css';
// import Example from '../Layouts/DashboardLayoutNew';
import Example from '@/Layouts/DashboardLayoutNew';
import { StoryNew } from '@/Components/Dashboard';
import { ShareYourThoughts, Filter, OutputData } from '@/Components/Reusable/WallPosting';
import MyComponent from '@/Components/Reusable/CommunitySide';

const Dashboard = () => {
  const { id } = usePage().props; // Retrieve the user_id from the Inertia view
  const [polls, setPolls] = useState([]);

  const handleCreatePoll = (poll) => {
    setPolls((prevPolls) => [...prevPolls, poll]);
  };

  return (
    <Example>
      <div className="flex-row">
        <div className="">
          <main className="xl:pl-[calc(22%+4rem)] xl:pr-[calc(25%+2rem)]">
            <div className=" px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex flex-col items-center ">
              <StoryNew userId={id} />
              <ShareYourThoughts userId={id} postType={'post'} onCreatePoll={handleCreatePoll} />
              <Filter className="mr-10" />
              <div className="mb-20"></div>
              <OutputData polls={polls} filterType={null} />
            </div>
          </main>

          <aside className="fixed bottom-0 left-20 top-16 hidden w-1/4 overflow-y-auto  px-4 py-6 sm:px-6 lg:px-8 xl:block">
            <style>
              {`
                aside::-webkit-scrollbar {
                  width: 0px !important;
                  background: transparent !important;
                }
                aside {
                  scrollbar-width: none !important; /* For Firefox */
                  -ms-overflow-style: none;  /* IE and Edge */
                }
              `}
            </style>
            <div className="file-directory-header">
              <PageTitle title="My Wall" />
            </div>
            <hr className="file-directory-underline" />
            <div>
              <FeaturedEvents />
              <WhosOnline />
            </div>
          </aside>

          <aside className="fixed bottom-0 right-0 top-16 hidden w-1/5 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-4 xl:block">
            <div>
              <MyComponent />
            </div>
          </aside>
        </div>
      </div>
    </Example>
  );
};

export default Dashboard;