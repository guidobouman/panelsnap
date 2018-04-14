import PanelSnap from './panelSnap';

describe('Constructor', () => {
  test('can init panelSnap', () => {
    const instance = new PanelSnap();
    expect(instance).toBeInstanceOf(PanelSnap);
  });

  test('prevents duplicate init of panelSnap on the same element', () => {
    const container = document.createElement('div');
    // eslint-disable-next-line no-unused-vars
    const firstInstance = new PanelSnap({ container });
    expect(() => new PanelSnap({ container })).toThrow('already initialised');
  });

  test('prevents duplicate init of panelSnap on the same element', () => {
    const container = document.createElement('div');
    // eslint-disable-next-line no-unused-vars
    const firstInstance = new PanelSnap({ container });
    expect(() => new PanelSnap({ container })).toThrow('already initialised');
  });
});
