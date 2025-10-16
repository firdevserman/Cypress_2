/// <reference types="cypress" />

describe('JSONPlaceholder API – E2E API Testleri', () => {

// 1) GET: temel doğrulama + response headers
it('GET /posts/1 → 200 ve JSON', () => {
  cy.request('/posts/1').then((res) => {
     expect(res.status).to.eq(200);
     expect(res.headers['content-type']).to.include('application/json');
     expect(res.body).to.have.property('id', 1);
     expect(res.body).to.have.all.keys('userId', 'id', 'title', 'body');
});
});

// 2) GET + query params (dinamik): tüm sonuçlar ilgili userId olmalı
it('GET /posts?userId=:id → filtreleme', () => {
    const userId = 1 + Math.floor(Math.random() * 10);
    cy.request({ url: '/posts', qs: { userId } }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array').and.to.have.length.greaterThan(0);
        res.body.forEach(p => expect(p.userId).to.eq(userId));
});
});

// 3) GET başka bir query: comments by postId
it('GET /comments?postId=1 → her kaydın postId=1', () => {
    cy.request({ url: '/comments', qs: { postId: 1 } }).then((res) => {
        expect(res.status).to.eq(200);
        res.body.forEach(c => expect(c.postId).to.eq(1));
});
});

// 4) HEADER gönderimi + doğrulama (gönderilen requestHeaders alanından)
it('GET /posts/1 → özel header gönderimi ve doğrulama', () => {
    cy.request({
        url: '/posts/1',
        headers: { 'x-homework': 'QA-101', 'user-agent': 'CypressHomework/1.0' },
}).then((res) => {
    expect(res.status).to.eq(200);
    const headers = Object.fromEntries(
        Object.entries(res.requestHeaders).map(([k, v]) => [k.toLocaleLowerCase(), v]) 
    )
    expect(res.requestHeaders).to.have.property('x-homework', 'QA-101');
    expect(res.requestHeaders).to.have.property('user-agent');
});
});

// 5) POST: kaynak oluşturma (201)
it('POST /posts → 201 ve dönen içerik', () => {
    const payload = { title: 'qa post', body: 'content', userId: 1 }
    cy.request('POST', '/posts', payload).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.include(payload);
        expect(res.body).to.have.property('id');
});
});

// 6) PUT: tam güncelleme

it('PUT /posts/1 → 200 ve güncellenen içerik', () => {
    const payload = { id: 1, title: 'updated', body: 'new body', userId: 1 }
    cy.request('PUT', '/posts/1', payload).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.eq(payload);
});
});

// 7) PATCH: kısmi güncelleme
it('PATCH /posts/1 → 200 ve kısmi alan', () => {
    const patch = { title: 'patched title' }
    cy.request('PATCH', '/posts/1', patch).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('title', 'patched title');
        expect(res.body).to.have.property('id', 1);
});
});

// 8) DELETE: silme işlemi
it('DELETE /posts/1 → 200', () => {
    cy.request('DELETE', '/posts/1').then((res) => {
        expect(res.status).to.eq(200);
});
});

// 9) Response time ölçümü
it('GET /posts → response time < 1500ms', () => {
    cy.request('/posts').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.duration).to.be.lessThan(1500);
});
});

// 10) Negatif senaryo: 404 beklenen endpoint
it('GET /this-should-404 → 404', () => {
    cy.request({ url: '/this-should-404', failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
});
});

// 11) Body formatı (schema benzeri basit doğrulama)
it('GET /users/1 → beklenen alanlar', () => {
    cy.request('/users/1').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.keys('id','name','username','email','address','phone','website','company'); 
        expect(res.body.address).to.have.keys('street','suite','city','zipcode','geo')
});
});

});