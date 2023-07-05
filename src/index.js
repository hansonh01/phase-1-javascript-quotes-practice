document.addEventListener('DOMContentLoaded', () => {
    const firstUrl = 'http://localhost:3000/quotes?_embed=likes';
    const quotesList = document.getElementById('quote-list');
    quotesList.innerText = '';
    function fetchQuotes() {
        fetch(firstUrl)
        .then(resp => resp.json())
        .then(quotes => {
            quotes.forEach(quote => {
                quotesList.appendChild(quoteCard(quote));
            })
        });
    };

    const quotesUrl = 'http://localhost:3000/quotes';
    const newQuote = document.getElementById('new-quote');
    const newAuthor = document.getElementById('author');

    document.getElementById('new-quote-form').addEventListener('submit',(e)=>{
        e.preventDefault();
        fetch(quotesUrl,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                quote : newQuote.value,
                author : newAuthor.value,
            })
        })
            .then(resp=>resp.json())
            .then(quote=>{
                newQuote.value = '';
                newAuthor.value = '';
                quotesList.appendChild(quoteCard(quote));
            })
    });

    function quoteCard(quote) {
    
        const li = document.createElement('li');
        li.classList = 'quote-card';
      
        const blockQuote = document.createElement('blockquote');
        blockQuote.classList = 'blockquote';
      
        const p = document.createElement('p');
        p.classList = 'mb-0';
        p.textContent = quote.quote;
        blockQuote.appendChild(p);
      
        const footer = document.createElement('footer');
        footer.classList = 'blockquote-footer';
        footer.textContent = quote.author;
        blockQuote.appendChild(footer);
      
        const btnSuccess = document.createElement('button');
        btnSuccess.classList = 'btn-success';
        btnSuccess.textContent = 'Likes: ';
        const span = document.createElement('span');
        span.textContent = 0;
        btnSuccess.appendChild(span);
        btnSuccess.addEventListener('click',()=>addLikes(quote.id,btnSuccess))
        blockQuote.appendChild(btnSuccess);
      
        const btnDanger = document.createElement('button');
        btnDanger.classList = 'btn-danger';
        btnDanger.textContent = 'Delete';
        btnDanger.addEventListener('click',()=>deleteQuote(quote.id,li))
        blockQuote.appendChild(btnDanger);
      
        li.appendChild(blockQuote);
        return li
    };
    
    function deleteQuote(quoteId,quoteElement){
        const quoteIdUrl = `http://localhost:3000/quotes/${quoteId}`
        fetch(quoteIdUrl,{
            method:'DELETE',
        })
        .then(resp=>resp.json())
        .then(()=>{
            quoteElement.remove();
        })
    }
    
    function addLikes(quoteId,btnSuccess){
        const likeUrl = 'http://localhost:3000/likes';
        fetch(likeUrl,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                quoteId:quoteId
            })
        })
            .then(resp=>resp.json())
            .then(()=>{
                const currentLike = parseInt(btnSuccess.querySelector('span').textContent);
                btnSuccess.querySelector('span').textContent = currentLike + 1;
            });
    };
    fetchQuotes();
});

