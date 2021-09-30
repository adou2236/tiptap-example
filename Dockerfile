FROM hub.zenki.cn/fe/alpine:nginx


#COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /web

CMD ["nginx"]
