Directory structure:
└── dannygauntletai-cusa/
    ├── README.md
    ├── CHANGELOG.md
    ├── LICENSE
    ├── directory.md
    ├── postcss.config.js
    ├── pyproject.toml
    ├── tailwind.config.js
    ├── .pre-commit-config.yaml
    ├── assets/
    ├── backend/
    │   ├── Dockerfile
    │   ├── alembic.ini
    │   ├── pyproject.toml
    │   ├── .dockerignore
    │   ├── app/
    │   │   ├── __init__.py
    │   │   ├── main.py
    │   │   ├── alembic/
    │   │   │   ├── README
    │   │   │   ├── env.py
    │   │   │   ├── script.py.mako
    │   │   │   └── versions/
    │   │   │       └── 2c0516590c18_initial_commit.py
    │   │   ├── api/
    │   │   │   ├── __init__.py
    │   │   │   ├── deps.py
    │   │   │   ├── main.py
    │   │   │   └── routes/
    │   │   │       ├── __init__.py
    │   │   │       ├── items.py
    │   │   │       └── utils.py
    │   │   ├── core/
    │   │   │   ├── __init__.py
    │   │   │   ├── auth.py
    │   │   │   ├── config.py
    │   │   │   └── db.py
    │   │   ├── crud/
    │   │   │   ├── __init__.py
    │   │   │   ├── base.py
    │   │   │   └── crud_item.py
    │   │   ├── models/
    │   │   │   ├── __init__.py
    │   │   │   ├── base.py
    │   │   │   ├── item.py
    │   │   │   └── user.py
    │   │   ├── schemas/
    │   │   │   ├── __init__.py
    │   │   │   └── auth.py
    │   │   ├── services/
    │   │   │   └── __init__.py
    │   │   └── utils/
    │   │       ├── __init__.py
    │   │       ├── init_data.py
    │   │       └── test_pre_start.py
    │   ├── scripts/
    │   │   ├── format.sh
    │   │   ├── lint.sh
    │   │   ├── pre-start.sh
    │   │   ├── test.sh
    │   │   └── tests-start.sh
    │   └── tests/
    │       ├── __init__.py
    │       ├── conftest.py
    │       ├── test_main.py
    │       ├── utils.py
    │       ├── api/
    │       │   ├── __init__.py
    │       │   └── api_v1/
    │       │       ├── __init__.py
    │       │       ├── test_items.py
    │       │       └── test_utils.py
    │       └── crud/
    │           ├── __init__.py
    │           └── test_item.py
    ├── frontend/
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   ├── .gitignore
    │   ├── public/
    │   └── src/
    │       ├── App.tsx
    │       ├── index.css
    │       ├── main.tsx
    │       ├── vite-env.d.ts
    │       ├── assets/
    │       ├── components/
    │       │   ├── home/
    │       │   │   ├── HomePage.tsx
    │       │   │   └── SearchInput.tsx
    │       │   └── layout/
    │       │       └── Layout.tsx
    │       └── features/
    │           └── home/
    │               ├── components/
    │               │   └── SearchInput.tsx
    │               └── pages/
    │                   └── HomePage.tsx
    ├── scripts/
    │   ├── bump.sh
    │   ├── start-dev.sh
    │   └── update-env.sh
    ├── supabase/
    │   └── config.toml
    └── .github/
        ├── CODEOWNERS
        ├── dependabot.yml
        ├── ISSUE_TEMPLATE/
        │   ├── bug_report.md
        │   └── feature_request.md
        └── workflows/
            └── main.yml