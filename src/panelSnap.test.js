import PanelSnap from './panelSnap';

describe('Constructor', () => {
  test('can init panelSnap', () => {
    const instance = new PanelSnap();
    expect(instance).toBeInstanceOf(PanelSnap);
  });

  test('prevents duplicate init of panelSnap on the same element', () => {
    // On default container: body
    expect(() => [
      new PanelSnap(),
      new PanelSnap(),
    ]).toThrow('already initialised');

    // On custom element
    const container = document.createElement('div');
    expect(() => [
      new PanelSnap({ container }),
      new PanelSnap({ container }),
    ]).toThrow('already initialised');
  });
});
