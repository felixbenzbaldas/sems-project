package sems;

import static org.junit.Assert.assertThat;
import static sems.Consts.CONTEXT;
import static sems.Consts.DEFAULT_EXPANDED;
import static sems.Consts.IS_PRIVATE;
import static sems.Consts.TEXT;

import org.hamcrest.CoreMatchers;
import org.junit.Test;

public class TestApp {

	@Test
	public void semsHouse_saveAndLoad() throws Exception {
		createTestSemsHouseZero();
		Persistence.saveSemsHouse(App.semsHouseZero);
		App.clearObjProperties();
		SemsHouse semsHouse = Persistence.loadSemsHouse(App.nameOfSemsHouseZero);
		assertThat(semsHouse.getRootObject(), CoreMatchers.not(CoreMatchers.nullValue()));
		SemsObject root = (SemsObject) semsHouse.getRootObject();
		String rootAddress = root.getSemsAddress();
		assertThat(root.getDetails().size(), CoreMatchers.is(1));
		assertThat(App.objProperties.get(rootAddress, TEXT), CoreMatchers.is("root"));
		assertThat(App.objProperties.get(rootAddress, DEFAULT_EXPANDED), CoreMatchers.is(true));
		assertThat(App.objProperties.get(rootAddress, IS_PRIVATE), CoreMatchers.is(false));
		SemsObject detail = (SemsObject) semsHouse.getInThisHouse(root.getDetails().get(0));
		String detailAddress = detail.getSemsAddress();
		assertThat(App.objProperties.get(detailAddress, IS_PRIVATE), CoreMatchers.is(true));
		assertThat(App.objProperties.get(detailAddress, CONTEXT), CoreMatchers.is(rootAddress));
		// test if list can be changed:
		root.addDetail(new SemsObject("123"));
	}

	public SemsHouse createTestSemsHouseZero() {
		SemsHouse semsHouse = new SemsHouse();
		App.semsHouseZero = semsHouse;
		SemsObject root = semsHouse.createSemsObject("root");
		semsHouse.setRootObject(root);
		SemsObject detail = semsHouse.insertContextDetailAtPosition(root, "detail", 0);
		App.objProperties.setProperty(detail.getSemsAddress(), IS_PRIVATE, true);
		return semsHouse;
	}
	
}