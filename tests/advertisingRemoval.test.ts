import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { createInstance } from 'i18next';
import { compile } from 'sass';
import en from '@/i18n/locales/en.json';
import { ProxyUrlField } from '@/features/config/components/fields/sharedFields';
import { ProviderResourcePanel } from '@/features/providers/components/ProviderResourcePanel';
import { OAuthPage } from '@/features/oauth/OAuthPage';
import { runVisualConfig } from './helpers/visualConfig';

describe('management without advertising', () => {
  test('reduced-motion inputs keep transitions disabled without permanent search highlighting', () => {
    const css = compile('src/features/config/components/fields/Field.module.scss').css;
    const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
    const inputRule = reduced.match(/\.fieldsRoot :global\(\.input\)[^{]*\{([^}]+)\}/)?.[1];
    expect(inputRule).toBeDefined();
    expect(inputRule).toMatch(/transition:\s*none/);
    expect(inputRule).not.toMatch(/outline|animation/);
    expect(reduced).toMatch(/\.fieldHighlightActive\s*\{[^}]*outline:/);
  });

  test('keeps proxy configuration without a proxy vendor recommendation', () => {
    const { visualValues: values } = runVisualConfig();
    const markup = renderToStaticMarkup(
      createElement(ProxyUrlField, { values, disabled: false, onChange: () => {} })
    );
    expect(markup).toContain('socks5://user:pass@127.0.0.1:1080/');
    expect(markup).not.toMatch(/bestproxy|sponsored|keyword=ayh7otlb/i);
  });

  test('empty provider groups offer configuration instead of registration', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'en', resources: { en: { translation: en } } });
    for (const id of ['apikeyFun', 'fennoAI', 'qiniuCloud', 'kimi'] as const) {
      const markup = renderToStaticMarkup(
        createElement(
          I18nextProvider,
          { i18n },
          createElement(ProviderResourcePanel, {
            group: { id, resources: [] },
            filter: '',
            onFilterChange: () => {},
            filteredResources: [],
            selectedId: null,
            onView: () => {},
            onEdit: () => {},
            onDelete: () => {},
            onCreate: () => {},
          })
        )
      );
      expect(markup).toContain(i18n.t('providersPage.actions.new'));
      expect(markup).not.toMatch(/<a\b|aff=|double11|register|sign up/i);
    }
  });

  test('preserves both Kimi login entries without signup promotions', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'en', resources: { en: { translation: en } } });
    const markup = renderToStaticMarkup(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(MemoryRouter, null, createElement(OAuthPage))
      )
    );
    expect(markup).toContain('kimi.com');
    expect(markup).toContain('kimi.ai');
    expect(markup).not.toMatch(/aff=|platform\.kimi|role="group"/);
  });
});
