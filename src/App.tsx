import { useState, useEffect } from 'react'

// 类型定义
interface Diary {
  id: string
  title: string
  content: string
  excerpt: string
  coverImage: string
  category: string
  date: string
  views: number
  comments: Comment[]
  author: string
}

interface Comment {
  id: string
  username: string
  content: string
  createdAt: string
}

interface User {
  id: string
  username: string
}

// 默认日记数据
const defaultDiaries: Diary[] = [
  {
    id: '1',
    title: '雨中的宁静',
    content: '窗外的雨滴轻轻敲打着玻璃，带来一份难得的宁静。我喜欢这样的天气，让人可以静下心来，思考生活中的点点滴滴。',
    excerpt: '窗外的雨滴轻轻敲打着玻璃...',
    coverImage: '/diary-rain.jpg',
    category: '生活',
    date: '2024-01-15',
    views: 1234,
    comments: [],
    author: '时光行者'
  },
  {
    id: '2',
    title: '咖啡与午后',
    content: '阳光透过咖啡馆的窗户，在桌面上投下斑驳的光影。我喜欢在这样的午后，品味一杯香浓的咖啡。',
    excerpt: '阳光透过咖啡馆的窗户...',
    coverImage: '/diary-coffee.jpg',
    category: '随笔',
    date: '2024-01-14',
    views: 987,
    comments: [],
    author: '时光行者'
  },
  {
    id: '3',
    title: '城市的黄昏',
    content: '夕阳西下，整座城市被染成了金黄色。站在高处俯瞰，楼宇间的光影交错，构成了一幅美丽的画卷。',
    excerpt: '夕阳西下，整座城市被染成了金黄色...',
    coverImage: '/diary-city.jpg',
    category: '摄影',
    date: '2024-01-13',
    views: 2156,
    comments: [],
    author: '时光行者'
  }
]

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('diaries')
    if (stored) {
      setDiaries(JSON.parse(stored))
    } else {
      setDiaries(defaultDiaries)
      localStorage.setItem('diaries', JSON.stringify(defaultDiaries))
    }
    
    const user = localStorage.getItem('currentUser')
    if (user && user !== 'null') {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogin = () => {
    if (!username.trim()) return
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existing = users.find((u: User) => u.username === username)
    
    let user: User
    if (existing) {
      user = existing
    } else {
      user = { id: Date.now().toString(), username: username.trim() }
      users.push(user)
      localStorage.setItem('users', JSON.stringify(users))
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
    setShowLogin(false)
    setUsername('')
    alert(existing ? `欢迎回来，${user.username}！` : '注册成功！')
  }

  const handleLogout = () => {
    localStorage.setItem('currentUser', 'null')
    setCurrentUser(null)
  }

  const openDiary = (diary: Diary) => {
    setSelectedDiary(diary)
    setShowDetail(true)
    
    const updated = diaries.map(d => 
      d.id === diary.id ? { ...d, views: d.views + 1 } : d
    )
    setDiaries(updated)
    localStorage.setItem('diaries', JSON.stringify(updated))
  }

  const submitComment = () => {
    if (!currentUser || !commentText.trim() || !selectedDiary) return
    
    const newComment: Comment = {
      id: Date.now().toString(),
      username: currentUser.username,
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    }
    
    const updated = diaries.map(d => 
      d.id === selectedDiary.id 
        ? { ...d, comments: [...d.comments, newComment] } 
        : d
    )
    
    setDiaries(updated)
    localStorage.setItem('diaries', JSON.stringify(updated))
    
    const updatedDiary = updated.find(d => d.id === selectedDiary.id)
    if (updatedDiary) setSelectedDiary(updatedDiary)
    
    setCommentText('')
    alert('评论发表成功！')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 100 
      }}>
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto', 
          padding: '0 20px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            时光<span style={{ color: '#ff6e00' }}>日记</span>
          </div>
          <div>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#666' }}>{currentUser.username}</span>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', border: 'none', 
                    color: '#ff6e00', cursor: 'pointer' 
                  }}
                >
                  退出
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                style={{ 
                  backgroundColor: '#ff6e00', color: 'white',
                  border: 'none', padding: '8px 16px',
                  borderRadius: '8px', cursor: 'pointer'
                }}
              >
                登录 / 注册
              </button>
            )}
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: '64px' }}>
        <section style={{ 
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          background: 'linear-gradient(135deg, #f2f2f2 0%, #fff 50%, #f2f2f2 100%)'
        }}>
          <div style={{ 
            maxWidth: '1200px', margin: '0 auto', padding: '40px 20px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px',
            alignItems: 'center', width: '100%'
          }}>
            <div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '24px' }}>
                时光日记
              </h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
                记录生活的点滴，分享每日的故事。每一天都是新的一页，每一刻都值得被铭记。
              </p>
              <button 
                onClick={() => document.getElementById('diaries')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ 
                  backgroundColor: '#ff6e00', color: 'white',
                  border: 'none', padding: '16px 32px',
                  borderRadius: '8px', fontSize: '16px',
                  cursor: 'pointer', fontWeight: 600
                }}
              >
                开始阅读
              </button>
            </div>
            <div>
              <img 
                src="/hero-portrait.jpg" 
                alt="时光日记"
                style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        <section id="diaries" style={{ padding: '80px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px' }}>
              最新日记
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '24px' 
            }}>
              {diaries.map(diary => (
                <div 
                  key={diary.id}
                  onClick={() => openDiary(diary)}
                  style={{ 
                    borderRadius: '16px', overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    cursor: 'pointer', transition: 'transform 0.3s',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img 
                    src={diary.coverImage} 
                    alt={diary.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '20px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      backgroundColor: '#ff6e00', color: 'white',
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', marginBottom: '12px'
                    }}>
                      {diary.category}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {diary.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5 }}>
                      {diary.excerpt}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', color: '#999', fontSize: '14px' }}>
                      <span>{diary.date}</span>
                      <span>👁 {diary.views}</span>
                      <span>💬 {diary.comments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {showLogin && (
        <div style={{ 
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200
        }} onClick={() => setShowLogin(false)}>
          <div style={{ 
            backgroundColor: 'white', padding: '32px', borderRadius: '16px',
            width: '90%', maxWidth: '400px'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              加入我们
            </h3>
            <input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ 
                width: '100%', padding: '12px', marginBottom: '16px',
                border: '2px solid #e5e5e5', borderRadius: '8px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={handleLogin}
              style={{ 
                width: '100%', backgroundColor: '#ff6e00', color: 'white',
                border: 'none', padding: '12px', borderRadius: '8px',
                fontSize: '16px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              开始旅程
            </button>
          </div>
        </div>
      )}

      {showDetail && selectedDiary && (
        <div style={{ 
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px'
        }} onClick={() => setShowDetail(false)}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '16px',
            width: '90%', maxWidth: '700px', maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img 
                src={selectedDiary.coverImage} 
                alt={selectedDiary.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
              }} />
              <h2 style={{ 
                position: 'absolute', bottom: '16px', left: '16px',
                color: 'white', fontSize: '24px', fontWeight: 'bold'
              }}>
                {selectedDiary.title}
              </h2>
              <button 
                onClick={() => setShowDetail(false)}
                style={{ 
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.5)', color: 'white',
                  border: 'none', width: '32px', height: '32px',
                  borderRadius: '50%', cursor: 'pointer', fontSize: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <p style={{ color: '#1a1a1a', lineHeight: 1.8, marginBottom: '24px' }}>
                {selectedDiary.content}
              </p>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                  评论 ({selectedDiary.comments.length})
                </h3>
                
                {currentUser ? (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <input
                      type="text"
                      placeholder="写下你的评论..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitComment()}
                      style={{ 
                        flex: 1, padding: '12px',
                        border: '2px solid #e5e5e5', borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                    <button 
                      onClick={submitComment}
                      style={{ 
                        backgroundColor: '#ff6e00', color: 'white',
                        border: 'none', padding: '12px 20px',
                        borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      发送
                    </button>
                  </div>
                ) : (
                  <p style={{ color: '#999', marginBottom: '24px' }}>
                    登录后可以发表评论
                  </p>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedDiary.comments.map(comment => (
                    <div key={comment.id} style={{ 
                      backgroundColor: '#f5f5f5', padding: '16px',
                      borderRadius: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontWeight: 600 }}>{comment.username}</span>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: '#666' }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App