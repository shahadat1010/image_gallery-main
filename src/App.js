import "./styles/tailwind.css";
import { Content } from "./utils/data";
import { useState } from "react";

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState(Content);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const toggleImageSelection = (index) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((item) => item !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDrop = (e, index) => {
    const droppedIndex = e.dataTransfer.getData("index");
    const newImages = images.filter((item, i) => i !== parseInt(droppedIndex));
    newImages.splice(index, 0, images[droppedIndex]);
    setImages(newImages);
    setDropTargetIndex(null);
  };

  const deleteImages = () => {
    const newImages = images.filter((item, index) => {
      return !selectedImages.includes(index);
    });
    setImages(newImages);
    setSelectedImages([]);
  };

  const addImages = (e) => {
    const files = e.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        newImages.push({ id: images.length + i + 1, src: reader.result });
        if (i === files.length - 1) {
          setImages([...images, ...newImages]);
        }
      };
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      const indexes = images.map((item, index) => index);
      setSelectedImages(indexes);
    } else {
      setSelectedImages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="container mx-auto bg-white rounded-md overflow-hidden relative">
        {selectedImages.length > 0 ? (
          <div className="nav flex justify-between px-6 p-4 border-b-[1px]">
            <div className="flex items-center gap-2 text-xl font-semibold justify-center">
              <input
                type="checkbox"
                checked={selectedImages.length > 0}
                onChange={selectAll}
              />
              {selectedImages.length} File selected
            </div>
            <div className="text-xl font-semibold text-rose-500 hover:text-red-600 duration-150">
              <button onClick={deleteImages}>Delete files</button>
            </div>
          </div>
        ) : (
          <h1 className=" text-xl  border-b-[1px] font-bold px-6 p-4">
            Gallery
          </h1>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 p-5">
          {images.map((item, index) => (
            <label
              key={item.id}
              className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                index === 0
                  ? "col-span-2 row-span-2"
                  : "col-span-1 max-h-[186px] row-span-1"
              }
             ${
               index === dropTargetIndex
                 ? "bg-blue-100 border-dashed border-2"
                 : ""
             }
             `}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              htmlFor={index}
            >
              {index !== dropTargetIndex ? (
                <>
                  <div
                    className={`absolute rounded-lg top-0 left-0 w-full h-full ${
                      selectedImages.includes(index)
                        ? "bg-white opacity-30"
                        : "bg-black opacity-0"
                    }  transition-opacity duration-300 group-hover:opacity-40`}
                  ></div>
                  <img
                    src={item.src}
                    alt=""
                    className="w-full border-2 rounded-lg shadow-sm"
                    onClick={() => toggleImageSelection(index)}
                  />
                  <div className="absolute top-0 left-0 p-2">
                    <input
                      id={index}
                      type="checkbox"
                      checked={selectedImages.includes(index)}
                      onChange={() => toggleImageSelection(index)}
                    />
                  </div>
                </>
              ) : null}
            </label>
          ))}
          <label
            htmlFor="file"
            className="flex min-h-[186px] justify-center items-center cursor-pointer col-span-1 row-span-1"
          >
            <input
              type="file"
              id="file"
              className="hidden"
              multiple
              onChange={addImages}
            />
            <div
              className="
              relative group cursor-pointer col-span-1 row-span-1
              h-full w-full
              rounded-lg border-2 border-dashed border-gray-400
              flex flex-col gap-3 justify-center items-center"
            >
              <img src="/aadd_image.svg" alt="add" height={24} width={24} />
              <p className=" font-semibold text-xl">Add Images</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
