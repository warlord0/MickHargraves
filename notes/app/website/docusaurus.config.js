module.exports = {
  title: 'Black Eyes & Broken Souls',
  tagline: 'Comprehensive Lore & Notes Archive',
  url: 'https://your-docusaurus-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'your-github-user',
  projectName: 'black-eyes-lore',
  
  // Add the local search plugin
  plugins: [],
  
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
          href: 'https://github.com/warlord0/MickHargraves',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Core Lore',
          items: [
            {
              label: 'Cosmology and Metaphysics',
              to: 'docs/lore/Cosmology and Metaphysics',
            },
            {
              label: 'Concise Guide',
              to: '/docs/lore/concise/Core Cosmology and Realm Structure',
            },

          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/warlord0/MickHargraves',
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
    // announcementBar: {
    //   id: 'black_eyes_lore',
    //   content: 'Explore the complete metaphysical framework of Black Eyes & Broken Souls',
    //   backgroundColor: '#300000',
    //   textColor: '#ffffff',
    //   isCloseable: true,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/warlord0/MickHargraves/edit/main/website/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
          ],
        },
      },
    ],
  ],
};