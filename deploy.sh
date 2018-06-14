cd build && git init && git add . && \
git commit -m "Deploy game" && \
git remote add origin git@github.com:msanatan/boxy.git && \
git push --force origin master:gh-pages
