const DEF_CATS=['Tin mới','Công nghệ','Thể thao','Đời sống','Giải trí'];


const DEF_POSTS=[{id:1,title:'Công nghệ AI đang thay đổi thế giới',category:'Công nghệ',image:'',content:'Nội dung mẫu',date:'22/09/2026',status:'published'},{id:2,title:'Những trận đấu đáng chú ý hôm nay',category:'Thể thao',image:'',content:'Nội dung mẫu',date:'22/09/2026',status:'published'}];function cats(){return JSON.parse(localStorage.getItem('newsCategories')||JSON.stringify(DEF_CATS.map((name,i)=>({id:i+1,name,slug:name.toLowerCase().replaceAll(' ','-')}))))}function posts(){return JSON.parse(localStorage.getItem('newsPosts')||JSON.stringify(DEF_POSTS))}function save(v){localStorage.setItem('newsPosts',JSON.stringify(v))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function fill(){const c=cats();
   
    filterCategory.innerHTML='<option value="">Tất cả danh mục</option>'+c.map(x=>`<option>${esc(x.name)}</option>`).join('');
    
    postCategory.innerHTML=c.map(x=>`<option>${esc(x.name)}</option>`).join('')}
    
    function renderPosts(){fill();
        const q=searchPost.value.toLowerCase(),c=filterCategory.value,s=filterStatus.value;
        
        const a=posts().filter(p=>p.title.toLowerCase().includes(q)&&(!c||p.category===c)&&(!s||p.status===s));
            postCount.textContent=`Hiển thị ${a.length} bài viết`;postTable.innerHTML=a.map(p=>`<tr><td>#${p.id}</td><td>${esc(p.title)}</td><td>${esc(p.category)}</td><td>${p.date}</td><td><span class="status ${p.status==='published'?'published':'draft'}">${p.status==='published'?'Đã đăng':'Bản nháp'}</span></td><td><button class="action-button edit" onclick="editPost(${p.id})">Sửa</button> <button class="action-button delete" onclick="deletePost(${p.id})">Xóa</button></td></tr>`).join('')}
        
        function openPostModal(id){postForm.reset();
            postId.value=id||'';postModalTitle.textContent=id?'Sửa bài viết':'Thêm bài viết';fill();if(id){const p=posts().find(x=>x.id===id);postTitle.value=p.title;postCategory.value=p.category;postImage.value=p.image||'';postContent.value=p.content;postStatus.value=p.status}postModal.classList.remove('hidden')}function closePostModal(){postModal.classList.add('hidden')}postForm.onsubmit=e=>{e.preventDefault();let a=posts(),id=Number(postId.value),d={title:postTitle.value.trim(),category:postCategory.value,image:postImage.value.trim(),content:postContent.value.trim(),status:postStatus.value,date:new Date().toLocaleDateString('vi-VN')};
            
            if(id){const i=a.findIndex(x=>x.id===id);a[i]={...a[i],...d}}else{d.id=Date.now();a.unshift(d)}save(a);
           
            closePostModal();
            
            renderPosts()};
            
    function editPost(id){openPostModal(id)}
    
    function deletePost(id){if(confirm('Xóa bài viết này?')){save(posts().filter(x=>x.id!==id));renderPosts()}}renderPosts();