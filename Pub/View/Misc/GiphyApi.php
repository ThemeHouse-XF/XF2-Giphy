<?php

namespace ThemeHouse\Giphy\Pub\View\Misc;

use XF\Mvc\View;

/**
 * Class GiphyApi
 * @package ThemeHouse\Giphy\Pub\View\Misc
 */
class GiphyApi extends View
{
    /**
     * @return mixed
     */
    public function renderJson()
    {
        return $this->params['results'];
    }
}