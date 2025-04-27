module.exports = {
    title: 'Black Eyes & Broken Souls',
    tagline: 'Comprehensive Lore & Notes Archive',
    url: 'https://your-docusaurus-site.com',
    baseUrl: '/',
    favicon: 'img/favicon.ico',
    organizationName: 'your-github-user',
    projectName: 'black-eyes-lore',
    
    // Add the local search plugin
    plugins: [
      [
        require.resolve('@cmfcmf/docusaurus-search-local'),
        {
          // whether to index blog posts
          indexBlog: false,
          // whether to index static pages
          indexPages: false,
          // language of your documentation
          language: "en",
          // style can be "none" or "full"
          style: "none",
          
          // lunr.js-specific settings
          lunr: {
            tokenizerSeparator: /[\s\-]+/,
            b: 0.75,
            k1: 1.2,
            titleBoost: 5,
            contentBoost: 1,
            tagsBoost: 3,
            headingBoost: 2,
          }
        }
      ],
    ],
    
    themeConfig: {
      navbar: {
        title: 'Black Eyes & Broken Souls',
        logo: {
          alt: 'Black Eyes Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'docs/lore/Cosmology and Metaphysics',
            activeBasePath: 'docs',
            label: 'Lore',
            position: 'left',
          },
          {
            to: '/search',
            label: 'Search',
            position: 'right',
          },
          {
            href: 'https://github.com/your-github-user/black-eyes-lore',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Lore',
            items: [
              {
                label: 'Cosmology',
                to: 'docs/lore/Cosmology and Metaphysics',
              },
              {
                label: 'Demonic Nature',
                to: 'docs/lore/Demonic Nature and Hierarchy',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-github-user/black-eyes-lore',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}`,
      },
      // Add dark mode toggle
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      // Add announcement bar for important info
      announcementBar: {
        id: 'black_eyes_lore',
        content: 'Explore the complete metaphysical framework of Black Eyes & Broken Souls',
        backgroundColor: '#300000',
        textColor: '#ffffff',
        isCloseable: true,
      },
    },
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl:
              'https://github.com/your-github-user/black-eyes-lore/edit/main/website/',
          },
          theme: {
            customCss: [
              require.resolve('./src/css/custom.css'),
              require.resolve('./src/css/search.css'),
              require.resolve('./src/css/horror-theme.css')
            ],
          },
        },
      ],
    ],
  };