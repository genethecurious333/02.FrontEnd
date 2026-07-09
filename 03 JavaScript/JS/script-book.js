// 카카오 Rest API 키 설정(본인의 발급 변수로 입력)
const REST_API_KEY = "7c56f97714293bc124044114ab65caf8";

async function searchBooks() {
    let query = document.getElementById("searchInput").value.trim();
    const bookList = document.getElementById("bookList");

    function getRandomKeyword() {
        const randomChar = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타','파', '하', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm','n','o','p','q','r','s','t','u','v','z','y','z'];
        const keyword = randomChar[Math.floor(Math.random() * randomChar.length)];
        console.log("keyword ===>", keyword);
        return keyword;
    }

    // 검색어가 비어 있으면 예외처리
    if (!query) {
        query = getRandomKeyword();
        // alert('검색어를 입력해주세요.');
        // return;
    }

    // 검색 결과 초기화 및 로딩 메세지 출력
    bookList.innerHTML='<p style="grid-column: 1/-1; text-align:center;">도서를 검색 중입니다....</p>'
    try {
        //카카오 도서 검색 요청 (fetch api)
        const response = await fetch(`https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(query)}&size=30`, 
        {
            method: 'GET',
            headers: {'Authorization' : `KakaoAK ${REST_API_KEY}`}
        }); 
        
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 발생했어요.');            
        }

        const data = await response.json();
        const books = data.documents;

        // 검색 결과가 없을 때
        if (books.length === 0) {
            bookList.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">검색 결과가 없어요.</p>';
            return;
        }

        // 데이터를 화면에 바인딩
        bookList.innerHTML = ''; // 화면 초기화

        books.forEach(book => {
            // 카드 엘리먼트 생성
            const card = document.createElement('div');
            card.className = 'book-card';

            // 표지 이미지 처리 
            const thumbnailSrc = book.thumbnail ? book.thumbnail : 'https://';

            // 저자 목록 문자열 집합
            const authorsName = book.authors.length > 0 ? book.authors.join(', ') : '저자미상'

            // 금액 포맷팅
            const formattedPrice = book.sale_price > 0 ? `${book.sale_price.toLocaleString()}원` : '판매중지/가격미정';

            // 카드에 바인딩
            card.innerHTML = `
                <img class = "book-thumbnail" src="${thumbnailSrc}" alt=${book.title} 표지>
                <div class="book-title" title="${book.title}">${book.title}</div>   
                <div class="book-authors">${authorsName}</div>
                <div class="book-price">${formattedPrice}</div>
            `;

            // 카드의 링크 처리
            card.style.cursor = 'pointer';
            card.onclick = () => {
                window.open(book.url, '_blank');  // book.url은 상세화면 나오면 그쪽으로 연결한다
            }

            // DOM Tree에 추가
            bookList.appendChild(card);

        });

    } catch(error) {
        console.log('에러 상태:', error);
        bookList.innerHTML = '<p style="grid-colum: 1/-1; text-align:center;">데이터 로딩 중 에러 발생.</p>';
    }
}