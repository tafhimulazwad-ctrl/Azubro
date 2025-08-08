@@ .. @@
 import React, { useState } from 'react';
-import { Star, MessageSquare, User, Calendar, ThumbsUp } from 'lucide-react';
+import { Star, MessageSquare, User, Calendar } from 'lucide-react';
 import { useBooks } from '../../context/BookContext';
 import { useAuth } from '../../context/AuthContext';
@@ .. @@
                 <div className="mt-4 flex items-center justify-between">
-                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
-                    <ThumbsUp size={16} />
-                    <span className="text-sm">Helpful</span>
-                  </button>
+                  <div className="text-sm text-gray-500">
+                    {review.createdAt}
+                  </div>
                 </div>
               </div>
             ))}