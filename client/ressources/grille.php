<?php
function genererGrille($elementsGrille, $tailleGrille) // 10 et 500
{
	$gap = $tailleGrille/($elementsGrille+1);

	$grille = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'.$tailleGrille.'" height="'.$tailleGrille.'">';

	$grille .= '<g class="cases" onmouseout="erasePos();">';
	$lettre = 'A';
	for ($i = 0 ; $i <= $elementsGrille ; $i++)
	{
		for ($j = 0 ; $j <= $elementsGrille ; $j++)
		{
			if ($i > 0 && $j > 0)
			{
				$identification = 'title="'.$lettre.($j).'" id="case_'.$lettre.($j).'"';
				$grille .= '<rect '.$identification.' onmouseover="showPos(\''.$lettre.'\', '.$j.');" x="'.round($i*$gap+1.5, 2).'" y="'.round($j*$gap+1.5, 2).'" width="'.round($gap-2, 2).'" height="'.round($gap-2, 2).'"/>'."\n";
			}
		}
		if ($i > 0) $lettre++;
	}

	$grille .= '</g><g class="posGrille">';

	$lettre = 'A';
	$x = ($gap*1.5);
	for ($i = 0 ; $i < $elementsGrille ; $i++)
	{
		$grille .= '<text x="'.round($x, 2).'" y="'.round($gap/2, 2).'" id="col'.$lettre.'">'.$lettre.'</text>'."\n";
		$grille .= '<text x="'.round($gap/2, 2).'" y="'.round($x, 2).'" id="row'.($i+1).'">'.($i+1).'</text>'."\n";
		$x += $gap;
		$lettre++;
	}
		  
	$grille .= '</g></svg>';
	return $grille;
}
