import PanelSnap from './panelSnap';

describe('Constructor', () => {
  test('can init panelSnap', () => {
    const instance = new PanelSnap();
    expect(instance).toBeInstanceOf(PanelSnap);
  });
});
