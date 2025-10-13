import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Package, Tag, Info } from "lucide-react";
import { getAllItems } from "@/lib/items";
const items = getAllItems();

const POCKET_NAMES = {
  1: "Items",
  2: "Medicine",
  3: "Poké Balls",
  4: "TMs & HMs",
  5: "Berries",
  6: "Mail",
  7: "Battle Items",
  8: "Key Items",
} as const;

export const ItemDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-gray-300" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Item not found
          </h1>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/items"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto w-fit"
          >
            <ArrowLeft size={20} />
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  const getPocketColor = (pocket: number) => {
    const colors = {
      1: "bg-gray-500",
      2: "bg-red-500",
      3: "bg-blue-500",
      4: "bg-yellow-500",
      5: "bg-green-500",
      6: "bg-purple-500",
      7: "bg-orange-500",
      8: "bg-pink-500",
    };
    return colors[pocket as keyof typeof colors] || "bg-gray-500";
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toLocaleString()}`;
  };

  const itemFlags = item.flags
    ? item.flags.split(",").map((f) => f.trim())
    : [];
  const pocketName =
    POCKET_NAMES[item.pocket as keyof typeof POCKET_NAMES] ||
    `Category ${item.pocket}`;

  // Find related items (same pocket)
  const relatedItems = items
    .filter((i) => i.pocket === item.pocket && i.id !== item.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/items"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            Back to Items
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.sprite || "/items/default.png"}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjQ4IiBjeT0iNDgiIHI9IjMwIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjQ4IiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {item.name}
                      </h1>
                      <p className="text-gray-600">ID: {item.id}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-2 rounded-lg text-white font-medium ${getPocketColor(
                          item.pocket,
                        )}`}
                      >
                        {pocketName}
                      </span>
                      <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                        <DollarSign size={24} />
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info
                          className="text-blue-500 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Item Properties */}
            {itemFlags.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="text-blue-500" size={24} />
                  Item Properties
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {itemFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span className="text-blue-800 font-medium">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="text-green-500" size={24} />
                  Related Items ({pocketName})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedItems.map((relatedItem) => (
                    <Link
                      key={relatedItem.id}
                      to={`/items/${relatedItem.id}`}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
                    >
                      <img
                        src={relatedItem.sprite || "/items/default.png"}
                        alt={relatedItem.name}
                        className="w-12 h-12 mx-auto mb-2 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjE2IiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjI0IiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                        }}
                      />
                      <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                        {relatedItem.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatPrice(relatedItem.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Item Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Item Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{item.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plural:</span>
                  <span className="font-semibold">{item.namePlural}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${getPocketColor(
                      item.pocket,
                    )}`}
                  >
                    {pocketName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <div className="flex items-center gap-1 font-bold text-green-600">
                    <DollarSign size={16} />
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Properties:</span>
                  <span className="font-semibold">{itemFlags.length}</span>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-sm">Item ID:</span>
                  <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-sm">
                    {item.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/items"
                  className="flex items-center gap-2 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Package size={20} />
                  Browse All Items
                </Link>

                <Link
                  to={`/items?pocket=${item.pocket}`}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Tag size={20} />
                  View {pocketName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
