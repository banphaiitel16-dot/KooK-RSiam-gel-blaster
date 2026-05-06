import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add states
const statesToAdd = `
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      product_id: "gb-001",
      user: "Somchai K.",
      rating: 5,
      comment: "ยิงสนุกมากครับ ปืนมีน้ำหนักดี งานประกอบเนียนมาก คุ้มราคา",
      date: "2 วันก่อน",
    },
    {
      id: "2",
      product_id: "gb-001",
      user: "Weerayut T.",
      rating: 5,
      comment: "ส่งไวมาก สั่งเมื่อวาน วันนี้ได้ของแล้ว แพ็คมาอย่างดีเลย",
      date: "1 สัปดาห์ก่อน",
    }
  ]);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
`;
code = code.replace(/const \[authError, setAuthError\] = useState\(""\);/, `const [authError, setAuthError] = useState("");` + statesToAdd);

const oldReviewSection = `<div className="space-y-4">
                    <div className="border-b border-zinc-800 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-tactical-gray rounded-full flex items-center justify-center text-xs font-bold text-white">S</div>
                          <span className="text-zinc-300 font-medium">Somchai K.</span>
                        </div>
                        <div className="flex text-tactical-red space-x-0.5">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-tactical-red" />)}
                        </div>
                      </div>
                      <p className="text-zinc-500">ยิงสนุกมากครับ ปืนมีน้ำหนักดี งานประกอบเนียนมาก คุ้มราคา</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-tactical-gray rounded-full flex items-center justify-center text-xs font-bold text-white">W</div>
                          <span className="text-zinc-300 font-medium">Weerayut T.</span>
                        </div>
                        <div className="flex text-tactical-red space-x-0.5">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-tactical-red" />)}
                        </div>
                      </div>
                      <p className="text-zinc-500">ส่งไวมาก สั่งเมื่อวาน วันนี้ได้ของแล้ว แพ็คมาอย่างดีเลย</p>
                    </div>
                  </div>`;

const newReviewSection = `<div className="space-y-4">
                    {reviews.filter(r => r.product_id === selectedProduct.id || r.product_id === "gb-001" /* show mock on all for visual */).map((review, i) => (
                      <div key={review.id + i} className="border-b border-zinc-800 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">{review.user.charAt(0)}</div>
                            <span className="text-zinc-300 font-medium text-sm">{review.user}</span>
                          </div>
                          <div className="flex text-tactical-red space-x-0.5">
                            {[1,2,3,4,5].map(star => <Star key={star} className={\`w-3 h-3 \${star <= review.rating ? 'fill-tactical-red' : 'text-zinc-700'}\`} />)}
                          </div>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <div className="mt-6 pt-4 border-t border-tactical-red/20">
                      <h4 className="text-white font-bold mb-3 text-sm">เขียนรีวิวของคุณ</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-zinc-400 text-sm">ให้คะแนน:</span>
                        <div className="flex text-tactical-red cursor-pointer">
                           {[1,2,3,4,5].map(star => (
                             <Star 
                               key={star} 
                               onClick={() => setNewReviewRating(star)}
                               className={\`w-5 h-5 transition-transform hover:scale-110 \${star <= newReviewRating ? 'fill-tactical-red' : 'text-zinc-700'}\`} 
                             />
                           ))}
                        </div>
                      </div>
                      <textarea
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="พิมพ์รีวิวของคุณที่นี่..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-tactical-red mb-3 min-h-[80px]"
                      />
                      <button
                        onClick={() => {
                          if (!newReviewComment.trim()) return;
                          const newReview = {
                            id: Date.now().toString(),
                            product_id: selectedProduct.id,
                            user: user.email.split('@')[0],
                            rating: newReviewRating,
                            comment: newReviewComment,
                            date: "เมื่อสักครู่",
                          };
                          setReviews([newReview, ...reviews]);
                          setNewReviewComment("");
                          setNewReviewRating(5);
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                      >
                        ส่งรีวิว
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                      <p className="text-zinc-500 text-sm text-center">กรุณาเข้าสู่ระบบเพื่อเขียนรีวิว</p>
                    </div>
                  )}`;

code = code.replace(oldReviewSection, newReviewSection);

fs.writeFileSync('src/App.tsx', code);
