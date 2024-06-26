import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Sample data for demo purpose
const initialApps = [
  { id: 1, name: 'e-library', url: 'https://bag.example.com/' },
  { id: 2, name: 'ERMS (Electronic Records)', url: 'https://babies.example.com/bag/bottle.aspx' },
  { id: 3, name: 'Executive Information Systems', url: 'https://www.example.com/?believe=bottle&belief=apparel' },
  { id: 4, name: 'HRMIS', url: 'https://www.example.com/' },
  { id: 5, name: 'MyFIS 2.0', url: 'http://boy.example.net/apparel/balance' },
  { id: 6, name: 'MyFIS: Tuntutan', url: 'http://example.com/actor/baby' },
  { id: 7, name: 'MyFIS Lite 2.0: Pejabat', url: 'http://www.example.com/' }
];

const Pautan = () => {
  const [apps, setApps] = useState(initialApps);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');

  const PautanHandleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedApps = Array.from(apps);
    const [reorderedItem] = reorderedApps.splice(result.source.index, 1);
    reorderedApps.splice(result.destination.index, 0, reorderedItem);

    setApps(reorderedApps);
  };

  const PautanHandleAddApp = () => {
    const newId = apps.length > 0 ? Math.max(...apps.map(app => app.id)) + 1 : 1;
    setApps([...apps, { id: newId, name: newAppName, url: newAppUrl }]);
    setNewAppName('');
    setNewAppUrl('');
    setIsAddModalVisible(false);
  };

  const PautanHandleDeleteApp = () => {
    setApps(apps.filter(app => app.id !== currentDeleteId));
    setIsDeleteModalVisible(false);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newApps = [...apps];
    [newApps[index - 1], newApps[index]] = [newApps[index], newApps[index - 1]];
    setApps(newApps);
  };

  const handleMoveDown = (index) => {
    if (index === apps.length - 1) return;
    const newApps = [...apps];
    [newApps[index + 1], newApps[index]] = [newApps[index], newApps[index + 1]];
    setApps(newApps);
  };

  const handleSave = () => {
    console.log("Changes saved", apps);
  };

  return (
    <>
      <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-10">
        <div className="flex items-center justify-between mb-2 border-b border-gray-200">
          <h2 className="mb-3 text-2xl font-bold text-blue-500 ">External Apps</h2>
          <button
            className="px-4 py-1 mb-2 font-bold text-white bg-blue-500 rounded-full"
            onClick={() => setIsAddModalVisible(true)}
          >
            + Add
          </button>
        </div>
        {/* <div className="flex justify-end mb-4 border-b border-gray-200">
        </div> */}
        <DragDropContext onDragEnd={PautanHandleDragEnd}>
          <Droppable droppableId="apps">
            {(provided) => (
              <table className="min-w-full divide-y divide-gray-200" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-base font-bold text-center text-gray-900">App name</th>
                    <th className="px-6 py-3 text-base font-bold text-center text-gray-900">URL</th>
                    <th className="px-6 py-3 text-base font-bold text-center text-gray-900">Order</th>
                    <th className="px-6 py-3 text-base font-bold text-center text-gray-900">Delete</th>
                  </tr>
                </thead>
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {apps.map((app, index) => (
                    <Draggable key={app.id} draggableId={String(app.id)} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          className="bg-white border-t border-gray-200" 
                          {...provided.draggableProps}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap "{...provided.dragHandleProps}>
                            <input
                              type="text"
                              value={app.name}
                              onChange={(e) => {
                                const newApps = [...apps];
                                newApps[index].name = e.target.value;
                                setApps(newApps);
                              }}
                              className="w-full p-1 border rounded-md outline-none border-E4E4E4"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap" {...provided.dragHandleProps}>
                            <input
                              type="text"
                              value={app.url}
                              onChange={(e) => {
                                const newApps = [...apps];
                                newApps[index].url = e.target.value;
                                setApps(newApps);
                              }}
                              className="w-full p-1 border rounded-md outline-none border-E4E4E4"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap"  {...provided.dragHandleProps}>
                            <div className="flex items-center justify-center">
                              <button
                                className="px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveUp(index);
                                }}
                                disabled={index === 0}
                                style={{ opacity: index === 0 ? 0.6 : 1 }}
                              >
                                <img src="assets/orderingup.svg" alt="Up" />
                              </button>
                              <button
                                className="px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveDown(index);
                                }}
                                disabled={index === apps.length - 1}
                                style={{ opacity: index === apps.length - 1 ? 0.6 : 1 }}
                              >
                                <img src="assets/orderingdown.svg" alt="Down" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <button
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentDeleteId(app.id);
                                  setIsDeleteModalVisible(true);
                                }}
                              >
                                <img src="assets/redDeleteIcon.svg" alt="Delete" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      {isAddModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">Add New App</h2>
            <input
              type="text"
              placeholder="App Name"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
            />
            <input
              type="text"
              placeholder="URL"
              value={newAppUrl}
              onChange={(e) => setNewAppUrl(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
            />
            <div className="flex justify-end space-x-3">
              <button className="px-8 py-1 text-base font-bold text-white bg-blue-500 rounded-full" onClick={PautanHandleAddApp}>
                Add
              </button>
              <button className="px-6 py-1 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsAddModalVisible(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold text-center">Delete the link?</h2>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-1 text-white font-bold bg-[#4880FF] rounded-full" onClick={PautanHandleDeleteApp}>
                Yes
              </button>
              <button className="px-8 py-1 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsDeleteModalVisible(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      <section className="flex justify-end mt-5 max-w-[900px]">
        <button className="px-4 py-1 font-bold text-white bg-[#FF5436] rounded-full shadow-custom" onClick={handleSave}>
          Save
        </button>
      </section>
    </>
  );
};

export default Pautan;
