'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, ArrowLeft, Eye, EyeOff, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

// Sortable Item Component for Depth 1
function SortableItem({
  item,
  onToggleActive,
  onDelete,
  onAddSubmenu,
  children,
}: {
  item: MenuItem;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onAddSubmenu: (parentId: string) => void;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 bg-[#14141a] border rounded-lg overflow-hidden transition-all duration-200 ${
        isDragging ? 'border-[#c5a880] shadow-2xl z-20' : 'border-stone-800 hover:border-stone-700'
      }`}
    >
      {/* Item Header Row */}
      <div className="p-4 flex items-center justify-between bg-[#181820] border-b border-stone-800/60">
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 text-stone-500 hover:text-[#c5a880] cursor-grab active:cursor-grabbing rounded transition-colors"
            title="Drag to reorder Depth 1"
          >
            <GripVertical size={18} />
          </button>

          {/* Badge & Title */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-white tracking-wide">{item.title}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                Depth 1
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20">
                {item.position}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">{item.url}</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Add Submenu Button */}
          <button
            onClick={() => onAddSubmenu(item.id)}
            className="flex items-center space-x-1 text-xs text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded transition-colors"
          >
            <Plus size={14} />
            <span>Add Submenu</span>
          </button>

          {/* Active Toggle Switch */}
          <div className="flex items-center space-x-2 border-l border-stone-800 pl-4">
            <span className="text-xs font-medium text-stone-400 flex items-center">
              {item.is_active ? (
                <span className="text-emerald-400 flex items-center">
                  <Eye size={13} className="mr-1" /> Active
                </span>
              ) : (
                <span className="text-stone-500 flex items-center">
                  <EyeOff size={13} className="mr-1" /> Hidden
                </span>
              )}
            </span>
            <button
              onClick={() => onToggleActive(item.id, !item.is_active)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                item.is_active ? 'bg-emerald-600' : 'bg-stone-800 border border-stone-700'
              }`}
              title={item.is_active ? 'Turn Off' : 'Turn On'}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  item.is_active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
            title="Delete Menu"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Children Submenu Items */}
      {children}
    </div>
  );
}

// Sortable Submenu Item Component for Depth 2
function SortableSubItem({
  subItem,
  onToggleActive,
  onDelete,
}: {
  subItem: MenuItem;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subItem.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 bg-[#111116] border-l-2 ${
        subItem.is_active ? 'border-l-[#c5a880]' : 'border-l-stone-700'
      } rounded my-1.5 flex items-center justify-between transition-all`}
    >
      <div className="flex items-center space-x-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-stone-600 hover:text-[#c5a880] cursor-grab active:cursor-grabbing"
          title="Drag to reorder Depth 2"
        >
          <GripVertical size={15} />
        </button>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-stone-200">{subItem.title}</span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
              Depth 2
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">{subItem.url}</span>
        </div>
      </div>

      {/* Depth 2 Toggle Switch */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggleActive(subItem.id, !subItem.is_active)}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
            subItem.is_active ? 'bg-emerald-600' : 'bg-stone-800 border border-stone-700'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              subItem.is_active ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
        <button
          onClick={() => onDelete(subItem.id)}
          className="p-1 text-stone-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function NavigationManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Position Tab State ('all' | 'header' | 'footer')
  const [activeTab, setActiveTab] = useState<'all' | 'header' | 'footer'>('all');

  // Modal State for New/Edit Menu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newParentId, setNewParentId] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<'header' | 'footer' | 'both'>('header');
  const [newImageUrl, setNewImageUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch all menus (Admin Mode)
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menus?mode=admin');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle is_active switch
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((parent) => {
        if (parent.id === id) {
          return { ...parent, is_active: currentActive };
        }
        if (parent.children) {
          return {
            ...parent,
            children: parent.children.map((child) =>
              child.id === id ? { ...child, is_active: currentActive } : child
            ),
          };
        }
        return parent;
      })
    );

    try {
      const res = await fetch('/api/menus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Menu status updated!`);
      } else {
        fetchMenus(); // Revert on failure
      }
    } catch (error) {
      console.error(error);
      fetchMenus();
    }
  };

  // Handle Drag & Drop for Depth 1 Items
  const handleDepth1DragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setItems(reordered);
    await saveReorder(reordered);
  };

  // Handle Drag & Drop for Depth 2 Submenu Items within a parent
  const handleDepth2DragEnd = async (parentId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const parent = items.find((i) => i.id === parentId);
    if (!parent || !parent.children) return;

    const oldIndex = parent.children.findIndex((c) => c.id === active.id);
    const newIndex = parent.children.findIndex((c) => c.id === over.id);

    const reorderedChildren = arrayMove(parent.children, oldIndex, newIndex).map(
      (child, idx) => ({
        ...child,
        sort_order: idx + 1,
      })
    );

    const updatedItems = items.map((i) =>
      i.id === parentId ? { ...i, children: reorderedChildren } : i
    );

    setItems(updatedItems);
    await saveReorder(updatedItems);
  };

  // Save sort order to backend API
  const saveReorder = async (updatedItems: MenuItem[]) => {
    setSaving(true);
    const payload: { id: string; sort_order: number; parent_id?: string | null }[] = [];

    updatedItems.forEach((p, pIdx) => {
      payload.push({ id: p.id, sort_order: pIdx + 1, parent_id: null });
      if (p.children) {
        p.children.forEach((c, cIdx) => {
          payload.push({ id: c.id, sort_order: cIdx + 1, parent_id: p.id });
        });
      }
    });

    try {
      const res = await fetch('/api/menus/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Menu sort order saved!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete menu item
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const res = await fetch(`/api/menus?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Menu item deleted');
        fetchMenus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new menu item submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          url: newUrl,
          parent_id: newParentId,
          position: newPosition,
          image_url: newImageUrl,
          is_active: true,
          sort_order: 99,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('New menu item created!');
        setIsModalOpen(false);
        setNewTitle('');
        setNewUrl('');
        setNewParentId(null);
        setNewImageUrl('');
        fetchMenus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-200 p-6 md:p-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center text-xs text-[#c5a880] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <Layers className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              Menu Control Panel
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Tabbed menu manager. Filter by Header or Footer, drag & drop items (`sort_order`), and toggle live `is_active` status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMenus}
            className="p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              setNewParentId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all shadow-lg"
          >
            <Plus size={16} />
            <span>Add Depth 1 Menu</span>
          </button>
        </div>
      </div>

      {/* Position Tabs Filter Bar (Header / Footer / All) */}
      <div className="max-w-5xl mx-auto mb-6 flex space-x-2 border-b border-stone-800 pb-3">
        {(['all', 'header', 'footer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs uppercase font-medium tracking-wider rounded transition-all ${
              activeTab === tab
                ? 'bg-[#c5a880] text-black font-semibold shadow-md'
                : 'bg-[#14141a] text-stone-400 border border-stone-800 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Menus' : tab === 'header' ? 'Header Menus' : 'Footer Menus'}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Menu Tree...</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDepth1DragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items
                .filter((p) => {
                  if (activeTab === 'all') return true;
                  return p.position === activeTab || p.position === 'both';
                })
                .map((parent) => (
                <SortableItem
                  key={parent.id}
                  item={parent}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  onAddSubmenu={(pId) => {
                    setNewParentId(pId);
                    setIsModalOpen(true);
                  }}
                >
                  {/* Depth 2 Children Container */}
                  <div className="p-3 bg-[#0d0d12] border-t border-stone-800/40">
                    <div className="text-[10px] tracking-wider uppercase text-stone-500 mb-2 font-mono flex items-center justify-between">
                      <span>Submenus ({parent.children?.length || 0})</span>
                      <span className="text-stone-600">Drag items below to sort Depth 2</span>
                    </div>

                    {parent.children && parent.children.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDepth2DragEnd(parent.id, e)}
                      >
                        <SortableContext
                          items={parent.children.map((c) => c.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {parent.children.map((child) => (
                            <SortableSubItem
                              key={child.id}
                              subItem={child}
                              onToggleActive={handleToggleActive}
                              onDelete={handleDelete}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="py-3 text-center text-stone-600 text-xs italic">
                        No submenus yet. Click "Add Submenu" above.
                      </div>
                    )}
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal for Creating Menu Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-stone-800 rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-serif-luxury text-white font-semibold mb-4">
              {newParentId ? 'Add Depth 2 Submenu' : 'Add Depth 1 Main Menu'}
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sintered Slabs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">URL / Path</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /collections/sintered-slab"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Position</label>
                <select
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value as any)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                >
                  <option value="header">Header Only</option>
                  <option value="footer">Footer Only</option>
                  <option value="both">Both Header & Footer</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Preview Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c5a880] text-black font-semibold rounded hover:bg-[#dbbc93]"
                >
                  Create Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
