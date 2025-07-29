import { useState } from "react";
import { Input } from "@shadcn/ui/input";
import { Card } from "@shadcn/ui/card";
import { Button } from "@shadcn/ui/button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ELEMENT_GROUPS = [
  {
    label: "Basic",
    elements: [
      { id: "text", label: "Text Field" },
      { id: "email", label: "Email" },
      { id: "number", label: "Number" },
      { id: "date", label: "Date" },
      { id: "dropdown", label: "Dropdown" },
      { id: "checkbox", label: "Checkbox" },
      { id: "radio", label: "Radio" },
    ],
  },
  {
    label: "Advanced",
    elements: [
      { id: "file", label: "File Upload" },
      { id: "rating", label: "Rating" },
      { id: "signature", label: "Signature" },
      { id: "section", label: "Section Break" },
    ],
  },
  {
    label: "Layout",
    elements: [
      { id: "1col", label: "1-Column" },
      { id: "2col", label: "2-Column" },
      { id: "3col", label: "3-Column" },
    ],
  },
];

export default function Sidebar({ onDragEnd }) {
  const [search, setSearch] = useState("");

  // Filter elements by search
  const filteredGroups = ELEMENT_GROUPS.map(group => ({
    ...group,
    elements: group.elements.filter(el => el.label.toLowerCase().includes(search.toLowerCase())),
  })).filter(group => group.elements.length > 0);

  return (
    <aside className="w-72 bg-white border-r h-full flex flex-col p-4 gap-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2">Form Elements</h2>
      <Input
        placeholder="Search elements..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {filteredGroups.map((group, groupIdx) => (
          <div key={group.label} className="mb-6">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{group.label}</div>
            <Droppable droppableId={group.label} isDropDisabled={true}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
                  {group.elements.map((el, idx) => (
                    <Draggable key={el.id} draggableId={el.id} index={idx}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 cursor-grab transition-shadow border ${snapshot.isDragging ? "shadow-lg border-blue-500" : "hover:shadow"}`}
                        >
                          {el.label}
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </aside>
  );
} 