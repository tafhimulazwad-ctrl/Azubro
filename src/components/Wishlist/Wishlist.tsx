@@ .. @@
                     <p className="text-gray-600">by {book.author}</p>
                   </div>
                   
                   <button
                     onClick={() => handleRemove(book.id)}
                     className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                     title="Remove from wishlist"
                   >
                     <Trash2 size={20} />
                   </button>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-3">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                     {book.condition}
                   </span>
                   <span className="text-sm text-gray-500">by {book.sellerName}</span>
                 </div>

-                <p className="text-gray-700 mb-4 line-clamp-2">{book.description}</p>
+                <p className="text-gray-700 mb-4 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{book.description}</p>
                 
                 <div className="flex items-center justify-between">