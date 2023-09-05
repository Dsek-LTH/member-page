FROM node:16

HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends texlive-latex-recommended texlive-fonts-recommended && \
    apt-get install -y --no-install-recommends texlive-latex-extra texlive-fonts-extra texlive-lang-all && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /frontend

ENV NODE_ENV=development

COPY ./.git ../.git
CMD npm run dev