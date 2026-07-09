const KAKAO_REST_API_KEY = "7c56f97714293bc124044114ab65caf8";

const SEARCH_QUERY = "점프 꿈을 향해 폭발적으로 도약하는 기술";

let salePrice = 0;

// 카카오 OPEN API 데이터 함수 호출
async function fetchBookInfo() {
    const url = `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(SEARCH_QUERY)}`;

    try {
        const response = await fetch(url, {
            method: "GET", 
            headers: {
                "Authorization": `KakaoAK ${KAKAO_REST_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error("API 요청이 실패 했어요.");
        }

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
            renderBookInfo(data.documents[0]);
        } else {
            document.getElementById('book-title').innerText = '검색 결과가 없어요.';
        }
    } catch (error) {
        console.log("에러 발생:", error);
        document.getElementById('book-title').innerText = '데이터를 가져오지 못했어요.';
    }

}

function renderBookInfo(book) {
    salePrice = book.sale_price > 0 ? book.sale_price : book.price;

    let originalThumbnail = book.thumbnail;
    if (originalThumbnail && originalThumbnail.includes('/thumb/R120x174.q85/?fname=')) {
        originalThumbnail = decodeURIComponent(originalThumbnail.split('?fname=')[1]);
    }

    document.getElementById('book-thumbnail').src = originalThumbnail || "https://placehold.co/150x220?text=No+Image";
    document.getElementById('book-title').innerText = book.title;
    document.getElementById('book-contents').innerText = book.contents ? book.contents.substring(0, 70) + "...": "불가능한 미래란 없다! 당신은 지금 뛰어 오를 준비를 마쳤는가?";

    // 저자, 출판사, ISBN 묶어서 넣기
    const authors = book.authors.join(', ');
    const publisher = book.publisher;
    const isbn = book.isbn.split(' ')[0];
    document.getElementById('book-meta').innerText = `저자 ${authors} | ${publisher} | ISBN : ${isbn}`;

    // 가격
    document.getElementById('price-original').innerText = `${book.price.toLocaleString()}원`;
    document.getElementById('price-sale').innerText = `${salePrice.toLocaleString()}원`;

    // 합계 금액 계산
    updateTotalPrice(1);
}

function updateTotalPrice(quantity) {
    const totalAmountEl = document.getElementById('total-amount');
    const total = salePrice * quantity;
    totalAmountEl.innerText = `${total.toLocaleString()}원`; // toLocaleString은 천단위로 콤마를 넣어주는 함수
}

function changeQuantity(delta) {
    const qty = document.getElementById('quantity');     // 객체
    let currentQty = parseInt(qty.value);                //  연산을 위해서 parseInt() 는 정수로 변환한다

    currentQty += delta;
    if (currentQty < 1) currentQty = 1;

    qty.value = currentQty;
    updateTotalPrice(currentQty);
}

// 페이지 로드 시 API 호출 작동시작
fetchBookInfo();